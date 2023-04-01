import { IProduct } from "../interfaces/product.interface";
import { IPantry } from "../../pantries/interfaces/pantry.interface";

export default class ProductOnPantry {
  product: IProduct;

  pantry: IPantry;

  quantity: number;

  bestBefore?: Date;

  storedAt: Date;

  boughtPrice?: number;

  constructor(
    product: IProduct,
    pantry: IPantry,
    quantity: number,
    bestBefore?: Date,
    storedAt?: Date,
    boughtPrice?: number
  ) {
    this.product = product;
    this.pantry = pantry;
    this.quantity = quantity;
    this.bestBefore = bestBefore;
    this.storedAt = storedAt ?? new Date();
    this.boughtPrice = boughtPrice ?? 0;
  }
}
