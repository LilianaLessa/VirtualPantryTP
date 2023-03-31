import { IProduct } from "../interfaces/product.interface";

export default class ProductClass implements IProduct {
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
    // eslint-disable-next-line comma-dangle
    packageWeight?: number
  ) {
    this.uuid = uuid;
    this.barCode = barCode ?? "";
    this.name = name ?? "";
    this.measureUnit = measureUnit ?? "";
    this.packageWeight = packageWeight ?? 1;
  }

  clone(override: Partial<IProduct>): IProduct {
    return new ProductClass(
      override.uuid ?? this.uuid,
      override.barCode ?? this.barCode,
      override.name ?? this.name,
      override.measureUnit ?? this.measureUnit,
      // eslint-disable-next-line comma-dangle
      override.packageWeight ?? this.packageWeight
    );
  }

  getKey(): string {
    return `product_${this.uuid}`;
  }
}
