import React, { createContext, useContext, useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDocs,
  getFirestore,
  onSnapshot,
  or,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { Firestore, QueryConstraint } from "@firebase/firestore";
import { FirebaseContext } from "./firebase.context";
import IFirestoreObject from "./interfaces/firestore-object.interface";

function sliceIntoChunks(arr, chunkSize) {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}

export type FirestoreCollectionSyncResult = {
  saved: IFirestoreObject[];
  deleted: IFirestoreObject[];
};

type FirestoreContextType = {
  saveObject: (firestoreObject: IFirestoreObject) => Promise<any>;
  deleteObject: (firestoreObject: IFirestoreObject) => Promise<any>;
  syncCollection: (
    ownerUid: string,
    collectionType: any,
    localCollection: IFirestoreObject[],
    onSavedDocSnapshot?: (d: DocumentData) => void
  ) => Promise<FirestoreCollectionSyncResult>;
  createCollectionListener: (
    collectionName: string,
    onAdded?: (data: any) => void,
    onModified?: (data: any) => void,
    onRemoved?: (data: any) => void,
    ...queryConstraints: QueryConstraint[]
  ) => any;
};

export const FirestoreContext = createContext<FirestoreContextType>({});

export function FirestoreContextProvider({
  children,
}: {
  children: React.ReactNode[] | React.ReactNode;
}) {
  const { firebaseApp } = useContext(FirebaseContext);

  const [firestore, setFirestore] = useState<Firestore | null>(
    firebaseApp ? getFirestore(firebaseApp) : null
  );

  useEffect(() => {
    // console.log("setting up firestore", firebaseApp?.name);
    setFirestore(firebaseApp ? getFirestore(firebaseApp) : null);
  }, [firebaseApp]);

  const saveObject = (firestoreObject: IFirestoreObject) => {
    if (!firestore) {
      return Promise.resolve(new Error("firestore not initiated."));
    }

    const collectionRef = collection(
      firestore,
      firestoreObject.firestoreCollectionName
    );
    const data = firestoreObject.getFirestoreData();
    return firestoreObject.firestoreId
      ? setDoc(
          doc(
            firestore,
            firestoreObject.firestoreCollectionName,
            firestoreObject.firestoreId ?? ""
          ),
          data
        ).then(() => firestoreObject)
      : addDoc(collectionRef, data).then((docRef) => {
          firestoreObject.firestoreId = docRef.id;
          return firestoreObject;
        });
  };

  const deleteObject = (firestoreObject: IFirestoreObject) => {
    if (!firestore) {
      return Promise.resolve(new Error("firestore not initiated."));
    }

    return firestoreObject.firestoreId
      ? deleteDoc(
          doc(
            firestore,
            firestoreObject.firestoreCollectionName,
            firestoreObject.firestoreId ?? ""
          )
        ).then(() =>
          addDoc(
            collection(
              firestore,
              firestoreObject.firestoreDeletedCollectionName
            ),
            {
              uuid: firestoreObject.uuid,
              docId: firestoreObject.firestoreId,
              deletedAt: new Date(),
            }
          )
        )
      : Promise.resolve();
  };

  // todo check if there is a way to type hint collectionType here.
  // todo it would be better if instead of ownerUid,
  //  the collection parent id field was configurable, and the value could be even an array.currentObjectsSnapshot
  function syncCollection(
    ownerUid: string,
    collectionType: any,
    localCollection: IFirestoreObject[],
    onSavedDocSnapshot?: (d: DocumentData) => void
  ): Promise<FirestoreCollectionSyncResult> {
    if (!firestore) {
      return Promise.resolve({ saved: [], deleted: [] });
    }
    console.log(`Firebase syncing collection '${collectionType.name}'`);

    const localCollectionUuidChunks = sliceIntoChunks(
      localCollection.map((o) => o.uuid),
      30
    );

    const getDeletedObjects =
      localCollection.length > 0
        ? getDocs(
            query(
              collection(
                firestore,
                collectionType.getFirestoreDeletedCollectionName()
              ),
              or(
                ...localCollectionUuidChunks.map((uuidsChunk) =>
                  where("uuid", "in", uuidsChunk)
                )
              )
            )
          ).catch((e) => {
            console.log(
              "failed to fetch data from firestore",
              e,
              collectionType.name
            );
          })
        : Promise.resolve({ docs: [] });

    return Promise.all([
      getDocs(
        query(
          collection(firestore, collectionType.getFirestoreCollectionName()),
          where("ownerUid", "==", ownerUid)
        )
      ),
      getDeletedObjects,
    ]).then((result) => {
      const [currentObjectsSnapshot, deletedObjectsSnapshot] = result;
      const saved: IFirestoreObject[] = [];
      const deleted: IFirestoreObject[] = [];
      const toSync: Promise<any>[] = [];

      const deletedObjectsUuids = deletedObjectsSnapshot.docs.map(
        (d) => d.data().uuid
      );

      const localCollectionMappedByUuid = localCollection.reduce(
        (m: Map<string, IFirestoreObject>, localObject: IFirestoreObject) => {
          // filtering deleted
          if (deletedObjectsUuids.includes(localObject.uuid)) {
            deleted.push(localObject);
          }
          // mapping
          return m.set(localObject.uuid, localObject);
        },
        new Map<string, IFirestoreObject>()
      );

      const remoteCollection = currentObjectsSnapshot.docs.map((d) =>
        collectionType.buildFromFirestoreData(d)
      );

      const remoteCollectionMappedByUuid = remoteCollection.reduce(
        (m: Map<string, IFirestoreObject>, remoteObject: IFirestoreObject) => {
          // do the updates
          const localObject = localCollectionMappedByUuid.get(
            remoteObject.uuid
          );
          if (localObject) {
            // conflict
            const localUpdatedAt = new Date(localObject.updatedAt);
            const remoteUpdatedAt = new Date(remoteObject.updatedAt);
            if (localUpdatedAt != remoteUpdatedAt) {
              if (localUpdatedAt > remoteUpdatedAt) {
                // local most updated
                if (!deletedObjectsUuids.includes(localObject.uuid)) {
                  // local not deleted
                  saved.push(localObject);
                  toSync.push(saveObject(localObject));
                }
              } else {
                // remote most updated;
                saved.push(remoteObject);
              }
            } else {
              // conflict, but same data.
              if (!deletedObjectsUuids.includes(localObject.uuid)) {
                // local not deleted
                saved.push(localObject);
              }
            }
          } else {
            // only remote
            saved.push(remoteObject);
          }

          // do the mapping
          return m.set(remoteObject.uuid, remoteObject);
        },
        new Map<string, IFirestoreObject>()
      );

      localCollection.forEach((localObject: IFirestoreObject) => {
        const remoteObject = remoteCollectionMappedByUuid.get(localObject.uuid);
        if (remoteObject) {
          // conflict
          const localUpdatedAt = new Date(localObject.updatedAt);
          const remoteUpdatedAt = new Date(remoteObject.updatedAt);
          if (localUpdatedAt != remoteUpdatedAt) {
            if (localUpdatedAt > remoteUpdatedAt) {
              if (!deletedObjectsUuids.includes(localObject.uuid)) {
                // local not deleted
                saved.push(localObject);
                toSync.push(saveObject(localObject));
              }
            } else {
              // remote most updated;
              saved.push(remoteObject);
            }
          } else {
            // conflict, but same data.
            if (!deletedObjectsUuids.includes(localObject.uuid)) {
              // local not deleted
              saved.push(localObject);
            }
          }
        } else {
          // only local
          if (!deletedObjectsUuids.includes(localObject.uuid)) {
            // local not deleted
            saved.push(localObject);
            toSync.push(saveObject(localObject));
          }
        }
      });

      // todo fix it to work with deletions and collection update.
      if (typeof onSavedDocSnapshot !== "undefined" && false) {
        currentObjectsSnapshot.docs.forEach((document) => {
          const localObject = saved.find((s) => (s.firestoreId = document.id));
          if (localObject) {
            onSnapshot(
              doc(
                firestore,
                collectionType.getFirestoreCollectionName(),
                localObject.firestoreId
              ),
              onSavedDocSnapshot
            );
          }
        });
      }

      return Promise.all(toSync).then(() =>
        Promise.resolve({
          saved,
          deleted,
        })
      );
    });
  }

  const createCollectionListener = (
    collectionName: string,
    onAdded?: (data: any) => void,
    onModified?: (data: any) => void,
    onRemoved?: (data: any) => void,
    ...queryConstraints: QueryConstraint[]
  ) => {
    const collectionQuery = query(
      collection(firestore, collectionName),
      ...queryConstraints
    );
    return onSnapshot(collectionQuery, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        switch (change.type) {
          case "added":
            if (onAdded) {
              onAdded(change.doc.data());
            }
            break;
          case "modified":
            if (onModified) {
              onModified(change.doc.data());
            }
            break;
          case "removed":
            if (onRemoved) {
              onRemoved(change.doc.data());
            }
            break;
          default:
            console.log("undefined data type");
        }
      });
    });
  };

  return (
    <FirestoreContext.Provider
      value={{
        saveObject,
        deleteObject,
        syncCollection,
        createCollectionListener,
      }}
    >
      {children}
    </FirestoreContext.Provider>
  );
}
