import React, { createContext, useContext, useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { Firestore } from "@firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "firebase/auth";
import firebase from "firebase/compat";
import { FirebaseContext } from "./firebase.context";
import { IProduct } from "../../features/products/interfaces/product.interface";
import Product from "../../features/products/classes/product.class";
import IFirestoreObject from "./interfaces/firestore-object.interface";
import DocumentData = firebase.firestore.DocumentData;

type FirestoreContextType = {
  getAllProductsFromUser: (
    user: User,
    successCallback: (result: any) => void
  ) => void;
  saveProductOnFirestore: (
    product: IProduct,
    successCallback?: (result: any) => void
  ) => void;
  deleteProductOnFirestore: (
    product: IProduct,
    successCallback?: (result: any) => void
  ) => void;
  filterDeletedProductsUuids: (
    uuids: string[],
    successCallback: (result: any) => void
  ) => void;
  saveObject: (firestoreObject: IFirestoreObject) => Promise<any>;
  deleteObject: (firestoreObject: IFirestoreObject) => Promise<any>;
  syncCollection: (
    ownerUid: string,
    collectionType: any,
    localCollection: IFirestoreObject[]
  ) => Promise<any>;
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

  const getAllProductsFromUser = (
    user: User,
    successCallback: (result: any) => void
  ) => {
    if (firestore) {
      const collectionRef = collection(firestore, "savedProducts");
      const q = query(collectionRef, where("ownerUid", "==", user.uid));

      getDocs(q)
        .then((querySnapshot) => {
          const products = Array<IProduct>();
          querySnapshot.forEach((doc) => {
            products.push(
              new Product(
                doc.data().uuid,
                doc.data().barCode,
                doc.data().name,
                doc.data().measureUnit,
                doc.data().packageWeight,
                doc.data().id,
                doc.data().ownerUid,
                doc.data().updatedAt.toDate().toString()
              )
            );
          });

          successCallback(products);
        })
        .catch((e) => {
          console.log(
            `failed to fetch products for the user ${user.uid} on firebase.`
          );
          successCallback(Array<IProduct>());
        });
    }
  };

  const filterDeletedProductsUuids = (
    uuids: string[],
    successCallback: (result: any) => void
  ) => {
    if (firestore) {
      // console.log("filterDeletedProductsUuids", uuids);
      const deletedProducts = collection(firestore, "deletedProducts");
      const q = query(deletedProducts, where("uuid", "in", uuids));

      getDocs(q)
        .then((querySnapshot) => {
          const products = Array<string>();
          querySnapshot.forEach((doc) => {
            products.push(doc.data().uuid);
          });

          successCallback(products);
        })
        .catch((e) => {
          // console.log("failed to fetch deleted products");
          successCallback(Array<IProduct>());
        });
    }
  };

  const saveProductOnFirestore = (
    product: IProduct,
    successCallback?: (result: any) => void
  ) => {
    AsyncStorage.getItem("@loggedUser").then((result) => {
      const storedUser = result ? JSON.parse(result) : null;
      if (storedUser === null) {
        // console.log("Skipping firestore save: No logged user");
        return;
      }
      if (firestore) {
        const collectionRef = collection(firestore, "savedProducts");
        const q = query(collectionRef, where("uuid", "==", product.uuid));
        // console.log("pre saving on firestore", product);
        getDocs(q)
          .then((querySnapshot) => {
            const documentIds = Array<string>([]);
            querySnapshot.forEach((doc) => {
              documentIds.push(doc.id);
              // console.log(` from firebase ${doc.id} =>`, doc.data());
            });
            if (documentIds.length > 0) {
              const documentId = documentIds.pop();
              updateDoc(doc(firestore, "savedProducts", documentId), {
                ...product,
                updatedAt: new Date(),
              })
                .then(() => {
                  // console.log(
                  //   `Product ${product.uuid} updated on Firestore: ${documentId}`
                  // );
                })
                .catch((e) => {
                  console.log(
                    `Product ${product.uuid} couldn't be updated on Firestore:`,
                    e
                  );
                });
            }
          })
          .catch((e) => {
            // console.log("Failed to fetch products from Firestore:", e);
            // console.log("Will try to create");
            addDoc(collectionRef, {
              ...product,
              id: null,
              updatedAt: new Date(),
            })
              .then((doc) => {
                // console.log(
                //   `Product ${product.uuid} saved to Firestore: ${doc.id}`
                // );
              })
              .catch((e) => {
                console.log(
                  `Product ${product.uuid} couldn't be saved to Firestore:`,
                  e
                );
              });
          });
      }
    });
  };

  const deleteProductOnFirestore = (
    product: IProduct,
    successCallback?: (result: any) => void
  ) => {
    AsyncStorage.getItem("@loggedUser").then((result) => {
      const storedUser = result ? JSON.parse(result) : null;
      if (storedUser === null) {
        console.log("Skipping firestore save: No logged user");
        return;
      }
      if (firestore) {
        const productCollectionRef = collection(firestore, "savedProducts");
        const deletedProductCollectionRef = collection(
          firestore,
          "deletedProducts"
        );
        const q = query(
          productCollectionRef,
          where("uuid", "==", product.uuid)
        );
        // console.log("pre deleting on firestore", product);
        getDocs(q)
          .then((querySnapshot) => {
            const documentIds = Array<string>([]);
            querySnapshot.forEach((doc) => {
              documentIds.push(doc.id);
              // console.log(` from firebase ${doc.id} =>`, doc.data());
            });
            if (documentIds.length > 0) {
              const documentId = documentIds.pop();
              deleteDoc(doc(firestore, "savedProducts", documentId))
                .then(() => {
                  // console.log(
                  //   `Product ${product.uuid} deleted from Firestore: ${documentId}`
                  // );
                  // add to deleted.
                  addDoc(deletedProductCollectionRef, {
                    uuid: product.uuid,
                    ownerUid: product.ownerUid,
                    deletedAt: new Date(),
                  })
                    .then((doc) => {
                      // console.log(
                      //   `Product ${product.uuid} deletion record saved to Firestore: ${doc.id}`
                      // );
                    })
                    .catch((e) => {
                      console.log(
                        `Product ${product.uuid} deletion record couldn't be saved to Firestore:`,
                        e
                      );
                    });
                })
                .catch((e) => {
                  console.log(
                    `Product ${product.uuid} couldn't be deleted from Firestore:`,
                    e
                  );
                });
            }
          })
          .catch((e) => {
            console.log("Failed to fetch products from Firestore:", e);
            console.log(`it wasn't possible to delete product ${product.uuid}`);
          });
      }
    });
  };

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
  function syncCollection(
    ownerUid: string,
    collectionType: any,
    localCollection: IFirestoreObject[]
  ): Promise<{ saved: IFirestoreObject[]; deleted: IFirestoreObject[] }> {
    if (!firestore) {
      return Promise.resolve({ saved: [], deleted: [] });
    }
    console.log(`Firebase syncing collection '${collectionType.name}'`);

    const getDeletedObjects =
      localCollection.length > 0
        ? getDocs(
            query(
              collection(
                firestore,
                collectionType.getFirestoreDeletedCollectionName()
              ),
              where(
                "uuid",
                "in",
                localCollection.map((o) => o.uuid)
              )
            )
          ).catch((e) => {
            console.log("eita", e);
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
            if (
              new Date(remoteObject.updatedAt) > new Date(localObject.updatedAt)
            ) {
              saved.push(remoteObject);
            } else {
              toSync.push(saveObject(localObject));
            }
          } else {
            saved.push(remoteObject);
          }
          // do the mapping
          return m.set(remoteObject.uuid, remoteObject);
        },
        new Map<string, IFirestoreObject>()
      );

      localCollection.forEach((localObject: IFirestoreObject) => {
        const remoteObject = remoteCollectionMappedByUuid.get(localObject.uuid);

        if (
          remoteObject &&
          new Date(remoteObject.updatedAt) > new Date(localObject.updatedAt)
        ) {
          saved.push(remoteObject);
        } else {
          toSync.push(saveObject(localObject));
        }
      });

      return Promise.all(toSync).then(() =>
        Promise.resolve({
          saved,
          deleted,
        })
      );
    });
  }

  return (
    <FirestoreContext.Provider
      value={{
        getAllProductsFromUser,
        saveProductOnFirestore,
        deleteProductOnFirestore,
        filterDeletedProductsUuids,
        saveObject,
        deleteObject,
        syncCollection,
      }}
    >
      {children}
    </FirestoreContext.Provider>
  );
}
