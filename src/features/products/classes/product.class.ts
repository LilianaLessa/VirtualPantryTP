import { IProduct } from "../interfaces/product.interface";

export default class Product implements IProduct {
  public name: string;

  constructor(name?: string) {
    this.name = name ?? "";
  }
}
