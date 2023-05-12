import { IProduct } from "./product.interface";
import { IPantry } from "../../pantries/interfaces/pantry.interface";

export interface IStoredProduct {
  id: number;
  uuid: string;

  product: Partial<IProduct>; // todo remove this Partial when finishing testing of notification

  pantry: IPantry;

  quantity: number;

  bestBefore?: Date;

  storedAt: Date;

  boughtPrice?: number;

  getKey: () => string;
}
