import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getFirestore,
  getDocs,
  collection,
  setDoc,
  doc,
  addDoc,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { Firestore } from "@firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FirebaseContext } from "./firebase.context";
import { IProduct } from "../../features/products/interfaces/product.interface";

type FirestoreContextType = {
  getAllProductsFromUser: (successCallback?: (result: any) => void) => void;
  saveProductOnFirestore: (
    product: IProduct,
    successCallback?: (result: any) => void
  ) => void;
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
    console.log("setting up firestore", firebaseApp?.name);
    setFirestore(firebaseApp ? getFirestore(firebaseApp) : null);
  }, [firebaseApp]);

  const getAllProductsFromUser = (successCallback?: (result: any) => void) => {
    if (firestore) {
      getDocs(collection(firestore, "savedProducts")).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(`${doc.id} =>`, doc.data());
        });
        if (successCallback) {
          successCallback(querySnapshot);
        }
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
        console.log("Skipping firestore save: No logged user");
        return;
      }
      if (firestore) {
        const collectionRef = collection(firestore, "savedProducts");
        const q = query(collectionRef, where("uuid", "==", product.uuid));
        console.log("pre saving on firestore", product);
        getDocs(q)
          .then((querySnapshot) => {
            const documentIds = Array<string>([]);
            querySnapshot.forEach((doc) => {
              documentIds.push(doc.id);
              console.log(` from firebase ${doc.id} =>`, doc.data());
            });
            if (documentIds.length > 0) {
              const documentId = documentIds.pop();
              updateDoc(doc(firestore, "savedProducts", documentId), {
                ...product,
                updatedAt: new Date(),
              })
                .then(() => {
                  console.log(
                    `Product ${product.uuid} updated on Firestore: ${documentId}`
                  );
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
            console.log("Failed to fetch products from Firestore:", e);
            console.log("Will try to create");
            addDoc(collectionRef, {
              ...product,
              id: null,
              updatedAt: new Date(),
            })
              .then((doc) => {
                console.log(
                  `Product ${product.uuid} saved to Firestore: ${doc.id}`
                );
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

  return (
    <FirestoreContext.Provider
      value={{ getAllProductsFromUser, saveProductOnFirestore }}
    >
      {children}
    </FirestoreContext.Provider>
  );
}
