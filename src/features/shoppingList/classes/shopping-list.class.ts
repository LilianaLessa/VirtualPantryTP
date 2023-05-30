// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { IBaseModule, TableBuilder } from "expo-sqlite-wrapper";
import { DocumentData } from "firebase/firestore";
import {
  LocalTable,
  TableNames,
} from "../../../services/applicationData/localDatabase/tables";
import IFirestoreObject from "../../../services/firebase/interfaces/firestore-object.interface";

export default class ShoppingList
  extends IBaseModule<TableNames>
  implements IFirestoreObject
{
  static localTableName = LocalTable.SHOPPING_LIST;

  uuid: string;

  name: string;

  ownerUid?: string;

  firestoreCollectionName = ShoppingList.getFirestoreCollectionName();

  firestoreDeletedCollectionName =
    ShoppingList.getFirestoreDeletedCollectionName();

  firestoreId?: string;

  updatedAt?: string;

  constructor(
    uuid: string,
    name?: string,
    id?: number,
    ownerUid?: string,
    firestoreId?: string,
    updatedAt?: string
  ) {
    super(ShoppingList.localTableName);
    this.uuid = uuid;

    this.name = name ?? "";

    if (typeof id !== "undefined") {
      this.id = id;
    }
    if (typeof ownerUid !== "undefined") {
      this.ownerUid = ownerUid;
    }
    if (typeof firestoreId !== "undefined") {
      this.firestoreId = firestoreId;
    }
    if (typeof updatedAt !== "undefined") {
      this.updatedAt = updatedAt;
    }
  }

  getKey(): string {
    return `shopping_list_${this.uuid}`;
  }

  clone(override?: Partial<ShoppingList>): ShoppingList {
    return new ShoppingList(
      override?.uuid ?? this.uuid,
      override?.name ?? this.name,
      override?.id ?? this.id,
      override?.ownerUid ?? this.ownerUid,
      override?.firestoreId ?? this.firestoreId,
      override?.updatedAt ?? this.updatedAt
    );
  }

  static GetTableStructor() {
    return TableBuilder<ShoppingList, TableNames>(ShoppingList.localTableName)
      .column("id")
      .primary.autoIncrement.number.column("uuid")
      .unique.string.column("name")
      .column("ownerUid")
      .string.nullable.column("updatedAt")
      .string.nullable.column("firestoreId")
      .string.nullable.objectPrototype(ShoppingList.prototype);
  }

  static buildFromDatabaseResult(r: ShoppingList): ShoppingList {
    return new ShoppingList(
      r.uuid,
      r.name,
      r.id,
      r.ownerUid,
      r.firestoreId,
      r.updatedAt
    );
  }

  getFirestoreData(): object {
    const {
      id,
      tableName,
      firestoreCollectionName,
      firestoreDeletedCollectionName,
      firestoreId,
      ...data
    } = this;
    return data;
  }

  static buildFromFirestoreData(doc: DocumentData): ShoppingList {
    return new ShoppingList(
      doc.data().uuid,
      doc.data().name,
      undefined,
      doc.data().ownerUid,
      doc.id,
      doc.data().updatedAt
    );
  }

  static getFirestoreCollectionName(): string {
    return "shoppingList";
  }

  static getFirestoreDeletedCollectionName(): string {
    return "deleted_shoppingList";
  }
}
