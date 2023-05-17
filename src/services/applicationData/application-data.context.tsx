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
  const { syncCollection } = useContext(FirestoreContext);
  const {
    initProductCollection,
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
    const db = DbContext.getInstance().database;
    const userUid = user?.uid;
    const args = userUid ? [userUid] : [];
    let query = `Select * from ${LocalTable.PRODUCT}`;
    query = `${query} WHERE ownerUid ${user === null ? "IS NULL" : " = ?"}`;

    return db.find(query, args).then((results: any) => {
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
              r.updatedAt,
              r.firestoreId
            )
          ),
        new Map<number, Product>()
      );
      (userUid
        ? syncCollection(
            userUid,
            Product,
            Array.from(localLoadedProducts.values())
          )
        : Promise.resolve({
            saved: Array.from(localLoadedProducts.values()),
            deleted: [],
          })
      ).then(({ saved, deleted }) => {
        Promise.all([
          ...saved.map((s) => db.save(s as Product)),
          ...deleted.map((d) => db.delete(d)),
        ]).then(() => {
          setLoadedProducts(saved);
        });
      });
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
    const db = DbContext.getInstance().database;
    const userUid = user?.uid;
    const args = userUid ? [userUid] : [];
    let query = `Select * from ${LocalTable.PANTRY}`;
    query = `${query} WHERE ownerUid ${user === null ? "IS NULL" : " = ?"}`;
    return DbContext.getInstance()
      .database.find(query, args)
      .then((results: any) => {
        const localLoadedPantries = results.reduce(
          (map: Map<number, Pantry>, r: Pantry) =>
            map.set(
              r.id,
              new Pantry(
                r.uuid,
                r.name,
                r.id,
                r.ownerUid,
                r.updatedAt,
                r.firestoreId
              )
            ),
          new Map<number, Pantry>()
        );

        (userUid
          ? syncCollection(
              userUid,
              Pantry,
              Array.from(localLoadedPantries.values())
            )
          : Promise.resolve({
              saved: Array.from(localLoadedPantries.values()),
              deleted: [],
            })
        ).then(({ saved, deleted }) => {
          Promise.all([
            ...saved.map((s) => db.save(s as Pantry)),
            ...deleted.map((d) => db.delete(d)),
          ]).then(() => {
            setLoadedPantries(saved);
          });
        });
      });
  };

  const { initStoredProductCollection } = useActions();
  const initStoredProducts = (user: User | null) => {
    const db = DbContext.getInstance().database;
    const userUid = user?.uid;
    const args = userUid ? [userUid] : [];
    let query = `Select * from ${LocalTable.STORED_PRODUCT}`;
    query = `${query} WHERE ownerUid ${user === null ? "IS NULL" : " = ?"}`;

    return db.find(query, args).then((results: any) => {
      // console.log(results);
      const localLoadedStoredProducts = results.reduce(
        (map: Map<number, StoredProduct>, r: StoredProduct) =>
          map.set(
            r.id,
            new StoredProduct(
              r.uuid,
              r.storedAt,
              r.pantryUuid,
              r.name,
              r.quantity,
              r.bestBefore,
              r.boughtPrice,
              r.ownerUid,
              r.productUuid,
              r.id,
              r.firestoreId,
              r.updatedAt
            )
          ),
        new Map<number, StoredProduct>()
      );

      (userUid
        ? syncCollection(
            userUid,
            StoredProduct,
            Array.from(localLoadedStoredProducts.values())
          )
        : Promise.resolve({
            saved: Array.from(localLoadedStoredProducts.values()),
            deleted: [],
          })
      ).then(({ saved, deleted }) => {
        Promise.all([
          ...saved.map((s) => db.save(s as StoredProduct)),
          ...deleted.map((d) => db.delete(d)),
        ]).then(() => {
          // console.log(query);
          initStoredProductCollection(saved);
        });
      });
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
          Promise.all([
            initGroups(storedUser),
            initSavedProducts(storedUser),
            initPantries(storedUser),
            initStoredProducts(storedUser),
          ]).then(() => {
            hideLoadingActivityIndicator();
            console.log("applicaton state loaded");
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
