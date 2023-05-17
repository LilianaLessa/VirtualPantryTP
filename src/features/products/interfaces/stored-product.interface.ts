import IFirestoreObject from "../../../services/firebase/interfaces/firestore-object.interface";

export interface IStoredProduct extends  {
  id: number;

  pantryUuid: string;

  storedAt: string;

  name?: string;

  quantity?: number;

  bestBefore?: string;

  boughtPrice?: number;

  productUuid: string;

  getKey: () => string;
}
