import IFirestoreObject from "../../../services/firebase/interfaces/firestore-object.interface";

export interface IProduct extends IFirestoreObject {
  id: number;
  name: string;
  measureUnit: string;
  packageWeight: number;
  barCode: string;

  getKey: () => string;

  clone: (override?: Partial<IProduct>) => IProduct;
}
