import createDbContext, { IDatabase } from "expo-sqlite-wrapper";
import * as SQLite from "expo-sqlite";
import Product from "../../../../features/products/classes/product.class";
import { TableNames } from "../tables";
import Pantry from "../../../../features/pantries/classes/pantry.class";
import StoredProduct from "../../../../features/products/classes/stored.product";
import Group from "../../../../features/group/classes/group.class";
import UserInGroup from "../../../../features/group/classes/user-in-group.class";
import ShoppingList from "../../../../features/shoppingList/classes/shopping-list.class";
import ShoppingListItem from "../../../../features/shoppingList/classes/shopping-list-item.class";
import Notification from "../../../../features/notification/classes/notification.class";
import Configuration from "../../../../features/configuration/classes/configuration.class";

const tables = [
  Product.GetTableStructor(),
  Pantry.GetTableStructor(),
  StoredProduct.GetTableStructor(),
  Group.GetTableStructor(),
  UserInGroup.GetTableStructor(),
  ShoppingList.GetTableStructor(),
  ShoppingListItem.GetTableStructor(),
  Notification.GetTableStructor(),
  Configuration.GetTableStructor(),
];
export default class DbContext {
  private static instance: DbContext;

  databaseName = "localStorage.db";

  database: IDatabase<TableNames>;

  private constructor() {
    this.database = createDbContext<TableNames>(
      tables,
      async () => SQLite.openDatabase(this.databaseName),
      undefined,
      true
    );
    // this.database.dropTables();
  }

  static getInstance = () => {
    DbContext.instance = DbContext.instance ?? new DbContext();
    return DbContext.instance;
  };
}
