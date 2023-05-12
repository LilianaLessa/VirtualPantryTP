export interface IProduct {
  id: number;
  name: string;
  measureUnit: string;
  packageWeight: number;
  barCode: string;
  uuid: string;
  ownerUid?: string;

  getKey: () => string;

  clone: (override: Partial<IProduct>) => IProduct;
}
