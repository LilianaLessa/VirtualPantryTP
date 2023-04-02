import { IProduct } from "./product.interface";
import { IPantry } from "../../pantries/interfaces/pantry.interface";

export interface IStoredProduct {
  uuid: string;

  product: IProduct;

  pantry: IPantry;

  quantity: number;

  bestBefore?: Date;

  storedAt: Date;

  boughtPrice?: number;
}
