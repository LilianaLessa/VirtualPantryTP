export interface IProduct {
  name: string;
  measureUnit: string;
  packageWeight: number;
  barCode: string;
  uuid: string;

  getKey: () => string;

  clone: (override: Partial<IProduct>) => IProduct;
}
