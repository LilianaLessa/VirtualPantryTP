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

  clone(override: Partial<IProduct>): IProduct {
    return new Product(
      override.uuid ?? this.uuid,
      override.barCode ?? this.barCode,
      override.name ?? this.name,
      override.measureUnit ?? this.measureUnit,
      override.packageWeight ?? this.packageWeight
    );
  }

  getKey(): string {
    return `product_${this.uuid}`;
  }
}