import { IPantry } from "../interfaces/pantry.interface";
import { IStoredProduct } from "../../products/interfaces/stored-product.interface";
import { IStoredProductMapKey } from "../../products/interfaces/stored-product-map-key.interface";
import StoredProduct from "../../products/classes/stored-product.class";

export default class Pantry implements IPantry {
  uuid: string;

  name: string;

  storedProducts: Map<IStoredProductMapKey, IStoredProduct>;

  constructor(
    uuid: string,
    name?: string,
    storedProducts?: Map<IStoredProductMapKey, IStoredProduct>
  ) {
    this.uuid = uuid;
    this.name = name ?? "";
    this.storedProducts =
      storedProducts ?? new Map<IStoredProductMapKey, IStoredProduct>();
  }

  getKey(): string {
    return `pantry_${this.uuid}`;
  }

  storeProduct(productToStore: IStoredProduct): void {
    this.storedProducts.set(
      { pantryUuid: this.uuid, productUuid: productToStore.uuid },
      productToStore
    );
  }

  // clone: (override: Partial<IPantry>) => IPantry;
}
