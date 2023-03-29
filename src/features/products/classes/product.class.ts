import { IProduct } from "../interfaces/product.interface";

export default class Product implements IProduct {
  public name: string;

  uuid: string;

  constructor(uuid: string, name?: string) {
    this.name = name ?? "";
    this.uuid = uuid;
  }

  getKey(): string {
    return `product_${this.uuid}`;
  }
}
