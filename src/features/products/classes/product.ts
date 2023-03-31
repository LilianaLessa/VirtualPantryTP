import { IProduct } from "../interfaces/product.interface";

export default class Product implements IProduct {
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
    packageWeight?: number
  ) {
    this.uuid = uuid;
    this.barCode = barCode ?? "";
    this.name = name ?? "";
    this.measureUnit = measureUnit ?? "";
    this.packageWeight = packageWeight ?? 1;
  }

  getKey(): string {
    return `product_${this.uuid}`;
  }
}
