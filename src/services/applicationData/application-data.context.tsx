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
import Group from "../../features/group/classes/group.class";
import UserInGroup from "../../features/group/classes/user-in-group.class";

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
  const { user } = useContext(AuthenticationContext);
  const {
    getAllProductsFromUser,
    saveProductOnFirestore,
    filterDeletedProductsUuids,
    syncCollection,
  } = useContext(FirestoreContext);
  const {
    initProductCollection,
    saveProductInSilent,
    deleteProductInSilent,
    showLoadingActivityIndicator,
    hideLoadingActivityIndicator,
  } = useActions();
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

        // console.log("loaded from local", user?.uid, localLoadedProducts);
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
                // console.log("product conflict. keep most updated version.");
                if (new Date(fp.updatedAt) > new Date(lp.updatedAt)) {
                  // console.log("product conflict: save from firebase");
                  saveProductInSilent(fp);
                } else {
                  // console.log("product conflict: save from local");
                  saveProductOnFirestore(lp);
                }
              } else {
                // console.log("product from firebase not on local: save");
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
                      // console.log("deleted product uuids found", deletedUuids);
                      deletedUuids.forEach((uuid) => {
                        // console.log("deleting local version of product", uuid);
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

  const { initGroupsCollection } = useActions();

  const initGroups = (user: User | null) => {
    const userUid = user?.uid;

    if (!userUid) {
      return Promise.resolve();
    }

    const db = DbContext.getInstance().database;
    return Promise.all([
      db.find(`SELECT * FROM ${LocalTable.GROUP} WHERE ownerUid = ?`, [
        userUid,
      ]),
      db.find(`SELECT * FROM ${LocalTable.USER_IN_GROUP} WHERE ownerUid = ?`, [
        userUid,
      ]),
    ])
      .then(([localGroups, localUsersInGroup]) => {
        const localGroupsByUuid = localGroups.reduce(
          (map: Map<string, Group>, r: Group) =>
            map.set(
              r.uuid,
              new Group(
                r.uuid,
                r.name,
                r.ownerUid,
                r.id,
                r.firestoreId,
                r.updatedAt
              )
            ),
          new Map<string, Group>()
        );

        const localUsersInGroupByUuid = localUsersInGroup.reduce(
          (map: Map<string, Group>, r: Group) =>
            map.set(
              r.uuid,
              new UserInGroup(
                r.uuid,
                userUid,
                r.groupUuid,
                r.email,
                r.isAdmin,
                r.isInviter,
                r.id,
                r.firestoreId,
                r.updatedAt
              )
            ),
          new Map<string, Group>()
        );

        Promise.all([
          syncCollection(
            userUid,
            Group,
            Array.from(localGroupsByUuid.values())
          ),
          syncCollection(
            userUid,
            UserInGroup,
            Array.from(localUsersInGroupByUuid.values())
          ),
        ]).then(
          ([
            { saved: savedGroups, deleted: deletedGroups },
            { saved: savedUsersInGroup, deleted: deletedUsersInGroup },
          ]) => {
            const savedGroupsByUuid = savedGroups.reduce(
              (m: Map<string, Group>, o) => m.set(o.uuid, o),
              new Map<string, Group>()
            );
            Promise.all([
              ...savedGroups.map((s) => db.save(s as Group)),
              ...savedUsersInGroup.map((s) => {
                savedGroupsByUuid.get(s.groupUuid)?.setUser(s);
                return db.save(s as UserInGroup);
              }),
              ...deletedGroups.map((d) =>
                db.delete(localGroupsByUuid.get(d.uuid) as Group)
              ),
              ...deletedUsersInGroup.map((d) =>
                db.delete(localUsersInGroupByUuid.get(d.uuid) as UserInGroup)
              ),
            ]).then(() => {
              initGroupsCollection(Array.from(savedGroupsByUuid.values()));
            });
          }
        );
      })
      .catch((e) => console.log("failed to init groups", e));
  };

  useEffect(() => {
    showLoadingActivityIndicator();
    AsyncStorage.getItem("@loggedUser").then((result) => {
      const storedUser = result ? JSON.parse(result) : null;

      DbContext.getInstance()
        .database.setUpDataBase()
        .then(() => {
          initGroups(storedUser).then(() => {
            initSavedProducts(storedUser).then(() => {
              initPantries(storedUser).then(() => {
                hideLoadingActivityIndicator();
                // initStoredProducts();
                // console.log("stored products not initiated.");
                // console.log("Application data loaded.");
              });
            });
          });
        });
    });
  }, [user]);

  return (
    <ApplicationDataContext.Provider value={{}}>
      {children}
    </ApplicationDataContext.Provider>
  );
}
