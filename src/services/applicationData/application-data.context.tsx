import React, { createContext, useEffect } from "react";
import { useActions } from "../../hooks/useActions";
import DbContext from "./localDatabase/classes/db-context.class";
import Product from "../../features/products/classes/product.class";
import { LocalTable } from "./localDatabase/tables";
import Pantry from "../../features/pantries/classes/pantry.class";

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
  const { initProductCollection, initPantryCollection } = useActions();

  const initSavedProducts = () => {
    DbContext.getInstance()
      .database.find(`Select * from ${LocalTable.PRODUCT}`, [])
      .then((results: any) => {
        initProductCollection(
          (results as Product[]).map((r) => {
            const entity = new Product(
              r.uuid,
              r.barCode,
              r.name,
              r.measureUnit,
              // eslint-disable-next-line comma-dangle
              r.packageWeight
            );
            entity.id = r.id;
            return entity;
          })
        );
      });
  };

  const initPantries = () => {
    DbContext.getInstance()
      .database.find(`Select * from ${LocalTable.PANTRY}`, [])
      .then((results: any) => {
        initPantryCollection(
          (results as Pantry[]).map((r) => {
            const entity = new Pantry(r.uuid, r.name);
            entity.id = r.id;
            return entity;
          })
        );
      });
  };

  useEffect(() => {
    initSavedProducts();
    initPantries();
  }, []);

  return (
    <ApplicationDataContext.Provider value={{}}>
      {children}
    </ApplicationDataContext.Provider>
  );
}
