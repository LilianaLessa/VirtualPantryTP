import { IBaseModule, TableBuilder } from "expo-sqlite-wrapper";
import { IStoredProduct } from "../interfaces/stored-product.interface";
import { IProduct } from "../interfaces/product.interface";
import { IPantry } from "../../pantries/interfaces/pantry.interface";
import {
  LocalTable,
  TableNames,
} from "../../../services/applicationData/localDatabase/tables";
import Product from "./product.class";
import Pantry from "../../pantries/classes/pantry.class";

export default class StoredProduct
  extends IBaseModule<TableNames>
  implements IStoredProduct
{
  uuid: string;

  productId: number;

  product: IProduct;

  pantryId: number;

  pantry: IPantry;

  quantity: number;

  bestBefore?: Date;

  storedAt: Date;

  boughtPrice?: number;

  constructor(
    uuid: string,
    product: IProduct,
    pantry: IPantry,
    quantity?: number,
    bestBefore?: Date,
    storedAt?: Date,
    boughtPrice?: number,
    id?: number
  ) {
    super(LocalTable.STORED_PRODUCT);
    // console.log(product.id, product);
    this.uuid = uuid;
    this.productId = product.id;
    this.product = product;
    this.pantryId = pantry.id;
    this.pantry = pantry;
    this.quantity = quantity ?? 0;
    this.bestBefore = bestBefore;
    this.storedAt = storedAt ?? new Date();
    this.boughtPrice = boughtPrice ?? 0;
    if (typeof id !== "undefined") {
      this.id = id;
    }
  }

  getKey(): string {
    return `stored_product_${this.uuid}`;
  }

  static GetTableStructor() {
    return TableBuilder<StoredProduct, TableNames>(LocalTable.STORED_PRODUCT)
      .column("id")
      .primary.autoIncrement.number.column("uuid")
      .unique.string.column("productId")
      .number.column("pantryId")
      .number.column("quantity")
      .number.nullable.column("boughtPrice")
      .number.nullable.column("storedAt")
      .dateTime.nullable.column("bestBefore")
      .dateTime.nullable.number.nullable.constrain<Product>(
        "productId",
        LocalTable.PRODUCT,
        "id"
      )
      .constrain<Pantry>("pantryId", LocalTable.PANTRY, "id");
  }
}
