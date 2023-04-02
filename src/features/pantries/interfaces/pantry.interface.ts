import { IStoredProduct } from "../../products/interfaces/stored-product.interface";
import { IStoredProductMapKey } from "../../products/interfaces/stored-product-map-key.interface";

export interface IPantry {
  uuid: string;
  name: string;
  storedProducts: Map<IStoredProductMapKey, IStoredProduct>;

  getKey: () => string;

  storeProduct: (productToStore: IStoredProduct) => void;

  // clone: (override: Partial<IPantry>) => IPantry;
}
