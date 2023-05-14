export default interface IFirestoreObject {
  uuid: string;
  firestoreCollectionName: string;
  firestoreDeletedCollectionName: string;
  firestoreId?: string;
  updatedAt?: string;

  getFirestoreData(): object;
}
