import createDbContext, { IDatabase } from "expo-sqlite-wrapper";
import * as SQLite from "expo-sqlite";
import Product from "../../../../features/products/classes/product.class";
import { TableNames } from "../tables";
import Pantry from "../../../../features/pantries/classes/pantry.class";
import StoredProduct from "../../../../features/products/classes/stored.product";

const tables = [
  Product.GetTableStructor(),
  Pantry.GetTableStructor(),
  StoredProduct.GetTableStructor(),
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
  }

  static getInstance = () => {
    DbContext.instance = DbContext.instance ?? new DbContext();
    return DbContext.instance;
  };
}
