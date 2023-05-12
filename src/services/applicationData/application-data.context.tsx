import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useActions } from "../../hooks/useActions";
import DbContext from "./localDatabase/classes/db-context.class";
import Product from "../../features/products/classes/product.class";
import { LocalTable } from "./localDatabase/tables";
import Pantry from "../../features/pantries/classes/pantry.class";
import StoredProduct from "../../features/products/classes/stored.product";
import { AuthenticationContext } from "../firebase/authentication.context";
import { FirestoreContext } from "../firebase/firestore.context";
import { IProduct } from "../../features/products/interfaces/product.interface";
import { deleteProductInSilent } from "../../state/action-creators";

// todo this context is responsible to initiate the reducers based on local or firestore data.

type ApplicationDataContextType = {};

export const ApplicationDataContext = createContext<ApplicationDataContextType>(
  {}
);

export function ApplicationDataContextProvider({
  children,
}: {
  children: React.ReactNode[] | React.ReactNode;
}) {
  const { isAuthenticated } = useContext(AuthenticationContext);
  const {
    getAllProductsFromUser,
    saveProductOnFirestore,
    filterDeletedProductsUuids,
  } = useContext(FirestoreContext);
  const { initProductCollection, saveProductInSilent, deleteProductInSilent } =
    useActions();
  const [loadedProducts, setLoadedProducts] = useState<Map<number, Product>>(
    new Map<number, Product>()
  );
  useEffect(() => {
    // console.log("useEffect on loadedProducts", loadedProducts);
    initProductCollection(Array.from(loadedProducts.values()));
  }, [loadedProducts]);

  const initSavedProducts = (user: User | null) => {
    const args = user ? [user.uid] : [];
    let query = `Select * from ${LocalTable.PRODUCT}`;
    query = `${query} WHERE ownerUid ${user === null ? "IS NULL" : " = ?"}`;

    return DbContext.getInstance()
      .database.find(query, args)
      .then((results: any) => {
        const localLoadedProducts = results.reduce(
          (map: Map<number, Product>, r: Product) =>
            map.set(
              r.id,
              new Product(
                r.uuid,
                r.barCode,
                r.name,
                r.measureUnit,
                r.packageWeight,
                r.id,
                r.ownerUid,
                r.updatedAt
              )
            ),
          new Map<number, Product>()
        );

        console.log("loaded from local", user?.uid, localLoadedProducts);
        setLoadedProducts(localLoadedProducts);

        if (user !== null) {
          getAllProductsFromUser(user, (productsFromFirebase) => {
            const localProductsByUuid = results.reduce(
              (map: Map<number, Product>, r: Product) =>
                map.set(
                  r.uuid,
                  new Product(
                    r.uuid,
                    r.barCode,
                    r.name,
                    r.measureUnit,
                    r.packageWeight,
                    r.id,
                    r.ownerUid,
                    r.updatedAt
                  )
                ),
              new Map<number, Product>()
            );

            productsFromFirebase.forEach((fp: IProduct) => {
              if (localProductsByUuid.has(fp.uuid)) {
                const lp = localProductsByUuid.get(fp.uuid);
                console.log("product conflict. keep most updated version.");
                if (new Date(fp.updatedAt) > new Date(lp.updatedAt)) {
                  console.log("product conflict: save from firebase");
                  saveProductInSilent(fp);
                } else {
                  console.log("product conflict: save from local");
                  saveProductOnFirestore(lp);
                }
              } else {
                console.log("product from firebase not on local: save");
                saveProductInSilent(fp);
              }
            });

            DbContext.getInstance()
              .database.find(query, args)
              .then((results: any) => {
                if (results.length > 0) {
                  filterDeletedProductsUuids(
                    results.map(({ uuid }: { uuid: string }) => uuid),
                    (deletedUuids: string[]) => {
                      console.log("deleted product uuids found", deletedUuids);
                      deletedUuids.forEach((uuid) => {
                        console.log("deleting local version of product", uuid);
                        deleteProductInSilent(localProductsByUuid.get(uuid));
                      });
                    }
                  );
                }
              });
          });
        }
      });
  };

  const { initPantryCollection } = useActions();
  const [loadedPantries, setLoadedPantries] = useState<Map<number, Pantry>>(
    new Map<number, Pantry>()
  );

  useEffect(() => {
    // console.log("useEffect on loadedPantries", loadedPantries);
    initPantryCollection(Array.from(loadedPantries.values()));
  }, [loadedPantries]);

  const initPantries = (user: User | null) => {
    const args = user ? [user.uid] : [];
    let query = `Select * from ${LocalTable.PANTRY}`;
    query = `${query} WHERE ownerUid ${user === null ? "IS NULL" : " = ?"}`;
    return DbContext.getInstance()
      .database.find(query, args)
      .then((results: any) => {
        setLoadedPantries(
          results.reduce(
            (map: Map<number, Pantry>, r: Pantry) =>
              map.set(r.id, new Pantry(r.uuid, r.name, r.id, r.ownerUid)),
            new Map<number, Pantry>()
          )
        );
      });
  };

  const { initStoredProductCollection } = useActions();
  const initStoredProducts = () => {
    if (loadedProducts.size < 1 || loadedPantries.size < 1) return;
    // DbContext.getInstance().database.dropTables();
    DbContext.getInstance()
      .database.find(`Select * from ${LocalTable.STORED_PRODUCT}`, [])
      .then((results: any) => {
        // console.log(results);

        const mappedResults: StoredProduct[] = [];

        (results as StoredProduct[]).forEach((r) => {
          // console.log("mapping", r, loadedProducts, loadedPantries);
          if (
            loadedProducts.has(r.productId) &&
            loadedPantries.has(r.productId)
          ) {
            mappedResults.push(
              new StoredProduct(
                r.uuid,
                loadedProducts.get(r.productId),
                loadedPantries.get(r.pantryId),
                r.quantity,
                r.bestBefore ? new Date(r.bestBefore) : new Date(),
                new Date(r.storedAt),
                r.boughtPrice,
                r.id
              )
            );
          }
        });
        initStoredProductCollection(mappedResults);
      });
  };

  useEffect(() => {
    AsyncStorage.getItem("@loggedUser").then((result) => {
      const storedUser = result ? JSON.parse(result) : null;

      DbContext.getInstance()
        .database.setUpDataBase()
        .then(() => {
          initSavedProducts(storedUser).then(() => {
            initPantries(storedUser).then(() => {
              // initStoredProducts();
              console.log("stored products not initiated.");
              console.log("Application data loaded.");
            });
          });
        });
    });
  }, [isAuthenticated]);

  return (
    <ApplicationDataContext.Provider value={{}}>
      {children}
    </ApplicationDataContext.Provider>
  );
}
