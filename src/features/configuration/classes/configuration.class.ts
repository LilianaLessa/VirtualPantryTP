import { IBaseModule, TableBuilder } from "expo-sqlite-wrapper";
import { DocumentData } from "firebase/firestore";
import {
  LocalTable,
  TableNames,
} from "../../../services/applicationData/localDatabase/tables";
import IFirestoreObject from "../../../services/firebase/interfaces/firestore-object.interface";

export type ConfigurationData = {
  productExpiringNotification: {
    enabled: boolean;
    hours: number;
    minutes: number;
    daysBefore: number;
  };
};

export default class Configuration
  extends IBaseModule<TableNames>
  implements IFirestoreObject
{
  static localTableName = LocalTable.CONFIGURATION;

  uuid: string;

  data: ConfigurationData;

  ownerUid: string;

  firestoreCollectionName = Configuration.getFirestoreCollectionName();

  firestoreDeletedCollectionName =
    Configuration.getFirestoreDeletedCollectionName();

  updatedAt?: string;

  firestoreId?: string;

  _serialized: string;

  constructor(
    uuid: string,
    data: ConfigurationData,
    ownerUid?: string,
    id?: number,
    firestoreId?: string,
    updatedAt?: string
  ) {
    super(Configuration.localTableName);
    this.uuid = uuid;
    this.data = data;

    this.serialized = this.data;

    if (typeof ownerUid !== "undefined") {
      this.ownerUid = ownerUid;
    }
    if (typeof id !== "undefined") {
      this.id = id;
    }
    if (typeof updatedAt !== "undefined") {
      this.updatedAt = updatedAt;
    }
    if (typeof firestoreId !== "undefined") {
      this.firestoreId = firestoreId;
    }
  }

  public clone(override?: Partial<Configuration>) {
    return new Configuration(
      override?.uuid ?? this.uuid,
      override?.data ?? this.data,
      override?.ownerUid ?? this.ownerUid,
      override?.id ?? this.id,
      override?.firestoreId ?? this.firestoreId,
      override?.updatedAt ?? this.updatedAt
    );
  }

  get serialized(): string {
    return JSON.parse(this._serialized);
  }

  set serialized(value: any) {
    this._serialized = JSON.stringify(value);
  }

  static GetTableStructor() {
    return TableBuilder<Configuration, TableNames>(Configuration.localTableName)
      .column("id")
      .primary.autoIncrement.number.column("uuid")
      .unique.string.column("_serialized")
      .nullable.string.column("ownerUid")
      .nullable.string.column("updatedAt")
      .nullable.string.column("firestoreId")
      .nullable.string.objectPrototype(Configuration.prototype);
  }

  static buildFromDatabaseResult(r: Configuration): Configuration {
    return new Configuration(
      r.uuid,
      JSON.parse(r._serialized),
      r.ownerUid,
      r.id,
      r.firestoreId,
      r.updatedAt
    );
  }

  static getFirestoreCollectionName(): string {
    return "configuration";
  }

  static getFirestoreDeletedCollectionName(): string {
    return "deleted_configuration";
  }

  static buildFromFirestoreData(doc: DocumentData): Configuration {
    return new Configuration(
      doc.data().uuid,
      doc.data().data,
      doc.data().ownerUid,
      undefined,
      doc.id,
      doc.data().updatedAt
    );
  }

  getFirestoreData(): object {
    const {
      id,
      tableName,
      firestoreCollectionName,
      firestoreDeletedCollectionName,
      serialized,
      firestoreId,
      _serialized,
      ...sendToFirestoreData
    } = this;
    return sendToFirestoreData;
  }
}
