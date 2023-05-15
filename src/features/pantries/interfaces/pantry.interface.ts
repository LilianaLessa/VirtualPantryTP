import IFirestoreObject from "../../../services/firebase/interfaces/firestore-object.interface";

export interface IPantry extends IFirestoreObject {
  id: number;
  name: string;

  getKey: () => string;
}
