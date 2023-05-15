import { DocumentData } from "firebase/firestore";

export default interface IFirestoreObject {
  uuid: string;
  ownerUid: string;
  firestoreCollectionName: string;
  firestoreDeletedCollectionName: string;
  firestoreId?: string;
  updatedAt?: string;
  getFirestoreData(): object;
  buildFromFirestoreData(doc: DocumentData): any;
  getFirestoreCollectionName(): string;
  getFirestoreDeletedCollectionName(): string;
}
