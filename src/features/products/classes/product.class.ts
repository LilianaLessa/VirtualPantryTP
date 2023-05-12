import { IBaseModule, TableBuilder } from "expo-sqlite-wrapper";
import { IProduct } from "../interfaces/product.interface";
import {
  LocalTable,
  TableNames,
} from "../../../services/applicationData/localDatabase/tables";

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
    packageWeight?: number,
    // eslint-disable-next-line comma-dangle
    id?: number
  ) {
    super(LocalTable.PRODUCT);
    this.uuid = uuid;
    this.barCode = barCode ?? "";
    this.name = name ?? "";
    this.measureUnit = measureUnit ?? "";
    this.packageWeight = packageWeight ?? 1;
    if (typeof id !== "undefined") {
      this.id = id;
    }
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
    return TableBuilder<Product, TableNames>(LocalTable.PRODUCT)
      .column("id")
      .primary.autoIncrement.number.column("uuid")
      .unique.string.column("barCode")
      .column("name")
      .column("measureUnit")
      .column("packageWeight")
      .objectPrototype(Product.prototype);
  }
}
