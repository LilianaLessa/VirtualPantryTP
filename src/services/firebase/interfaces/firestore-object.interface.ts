export default interface IFirestoreObject {
  firestoreCollectionName: string;
  firestoreDeletedCollectionName: string;
  firestoreId?: string;
  updatedAt?: string;

  getFirestoreData(): object;
}
