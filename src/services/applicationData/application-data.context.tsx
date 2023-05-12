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
  const { initProductCollection } = useActions();
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
        setLoadedProducts(
          results.reduce(
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
                  r.ownerUid
                )
              ),
            new Map<number, Product>()
          )
        );
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
    // console.log(loadedProducts, loadedPantries);
    initStoredProducts();
  }, [initStoredProducts, loadedProducts, loadedPantries]);

  useEffect(() => {
    AsyncStorage.getItem("@loggedUser").then((result) => {
      const storedUser = result ? JSON.parse(result) : null;

      DbContext.getInstance()
        .database.setUpDataBase()
        .then(() => {
          initSavedProducts(storedUser).then(() => {
            initPantries(storedUser).then(() => {
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
