import React, { createContext, useEffect } from "react";
import Product, {
  ProductDbContext,
} from "../../features/products/classes/product.class";
import { useActions } from "../../hooks/useActions";
import { IProduct } from "../../features/products/interfaces/product.interface";

type ApplicationDataContextType = {};

export const ApplicationDataContext = createContext<ApplicationDataContextType>(
  {}
);

export function ApplicationDataContextProvider({
  children,
}: {
  children: React.ReactNode[] | React.ReactNode;
}) {
  const { initProductCollection } = useActions();

  useEffect(() => {
    ProductDbContext.getInstance()
      .database.setUpDataBase()
      .then(() => {
        ProductDbContext.getInstance()
          .database.find("Select * from savedProducts", [])
          .then((results: any) => {
            initProductCollection(
              (results as IProduct[]).map(
                (r) =>
                  new Product(
                    r.uuid,
                    r.barCode,
                    r.name,
                    r.measureUnit,
                    // eslint-disable-next-line comma-dangle
                    r.packageWeight
                  )
              )
            );
          });
      });
  }, [initProductCollection]);

  return (
    <ApplicationDataContext.Provider value={{}}>
      {children}
    </ApplicationDataContext.Provider>
  );
}
