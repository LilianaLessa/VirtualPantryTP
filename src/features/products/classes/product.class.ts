import createDbContext, {
  IBaseModule,
  TableBuilder,
  IDatabase,
} from "expo-sqlite-wrapper";
import * as SQLite from "expo-sqlite";
import { IProduct } from "../interfaces/product.interface";

export type TableNames = "savedProducts";

export default class Product
  extends IBaseModule<TableNames>
  implements IProduct
{
  public name: string;

  public measureUnit: string;

  public packageWeight: number;

  public barCode: string;

  uuid: string;

  constructor(
    uuid: string,
    barCode?: string,
    name?: string,
    measureUnit?: string,
    // eslint-disable-next-line comma-dangle
    packageWeight?: number
  ) {
    super("savedProducts");
    this.uuid = uuid;
    this.barCode = barCode ?? "";
    this.name = name ?? "";
    this.measureUnit = measureUnit ?? "";
    this.packageWeight = packageWeight ?? 1;
  }

  clone(override: Partial<IProduct>): IProduct {
    return new Product(
      override.uuid ?? this.uuid,
      override.barCode ?? this.barCode,
      override.name ?? this.name,
      override.measureUnit ?? this.measureUnit,
      // eslint-disable-next-line comma-dangle
      override.packageWeight ?? this.packageWeight
    );
  }

  getKey(): string {
    return `product_${this.uuid}`;
  }

  // This method will return the table setup that we will be using later on in `repository`
  static GetTableStructor() {
    return TableBuilder<Product, TableNames>("savedProducts")
      .column("id")
      .primary.autoIncrement.number.column("uuid")
      .unique.string.column("barCode")
      .column("name")
      .column("measureUnit")
      .column("packageWeight")
      .objectPrototype(Product.prototype);
  }
}

const tables = [Product.GetTableStructor()];
export class ProductDbContext {
  private static instance: ProductDbContext;

  databaseName = "localStorage.db";

  database: IDatabase<TableNames>;

  private constructor() {
    this.database = createDbContext<TableNames>(tables, async () =>
      SQLite.openDatabase(this.databaseName)
    );
  }

  static getInstance = () => {
    ProductDbContext.instance =
      ProductDbContext.instance ?? new ProductDbContext();
    return ProductDbContext.instance;
  };
}

// ProductDbContext.instance.database.dropTables().then(() => {
//   console.log("tables dropped");
// });
