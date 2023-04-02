import { IProduct } from "../interfaces/product.interface";
import { IPantry } from "../../pantries/interfaces/pantry.interface";
import { IStoredProduct } from "../interfaces/stored-product.interface";

export default class StoredProduct implements IStoredProduct {
  uuid: string;

  product: IProduct;

  pantry: IPantry;

  quantity: number;

  bestBefore?: Date;

  storedAt: Date;

  boughtPrice?: number;

  constructor(
    uuid: string,
    product: IProduct,
    pantry: IPantry,
    quantity: number,
    bestBefore?: Date,
    storedAt?: Date,
    boughtPrice?: number
  ) {
    this.uuid = uuid;
    this.product = product;
    this.pantry = pantry;
    this.quantity = quantity;
    this.bestBefore = bestBefore;
    this.storedAt = storedAt ?? new Date();
    this.boughtPrice = boughtPrice ?? 0;
  }
}
