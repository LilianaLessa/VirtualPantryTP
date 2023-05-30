// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { IBaseModule, TableBuilder } from "expo-sqlite-wrapper";
import { DocumentData } from "firebase/firestore";
import { IPantry } from "../interfaces/pantry.interface";
import {
  LocalTable,
  TableNames,
} from "../../../services/applicationData/localDatabase/tables";

export default class Pantry extends IBaseModule<TableNames> implements IPantry {
  uuid: string;

  name: string;

  ownerUid?: string;

  updatedAt?: string;

  firestoreCollectionName = Pantry.getFirestoreCollectionName();

  firestoreDeletedCollectionName = Pantry.getFirestoreDeletedCollectionName();

  firestoreId: string;

  constructor(
    uuid: string,
    name?: string,
    id?: number,
    ownerUid?: string,
    updatedAt?: string,
    firestoreId?: string
  ) {
    super(LocalTable.PANTRY);
    this.uuid = uuid;
    this.name = name ?? "";
    if (typeof id !== "undefined") {
      this.id = id;
    }
    if (typeof ownerUid !== "undefined") {
      this.ownerUid = ownerUid;
    }
    if (typeof updatedAt !== "undefined") {
      this.updatedAt = updatedAt;
    }

    if (typeof firestoreId !== "undefined") {
      this.firestoreId = firestoreId;
    }
  }

  getKey(): string {
    return `pantry_${this.uuid}`;
  }

  clone(override?: Partial<Pantry>): Pantry {
    return new Pantry(
      override?.uuid ?? this.uuid,
      override?.name ?? this.name,
      override?.id ?? this.id,
      override?.ownerUid ?? this.ownerUid,
      override?.updatedAt ?? this.updatedAt,
      override?.firestoreId ?? this.firestoreId
    );
  }

  static GetTableStructor() {
    return TableBuilder<Pantry, TableNames>(LocalTable.PANTRY)
      .column("id")
      .primary.autoIncrement.number.column("uuid")
      .unique.column("name")
      .column("ownerUid")
      .string.nullable.column("updatedAt")
      .string.nullable.column("firestoreId")
      .string.nullable.objectPrototype(Pantry.prototype);
  }

  static buildFromFirestoreData(doc: DocumentData): Pantry {
    return new Pantry(
      doc.data().uuid,
      doc.data().name,
      undefined,
      doc.data().ownerUid,
      doc.data().updatedAt,
      doc.id
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

  static getFirestoreCollectionName(): string {
    return "pantry";
  }

  static getFirestoreDeletedCollectionName(): string {
    return "deleted_pantry";
  }
}
