import { IBaseModule, TableBuilder } from "expo-sqlite-wrapper";
import { DocumentData } from "firebase/firestore";
import {
  LocalTable,
  TableNames,
} from "../../../services/applicationData/localDatabase/tables";
import IFirestoreObject from "../../../services/firebase/interfaces/firestore-object.interface";

type MessageNotificationData = {
  message: string;
};

type ProductExpirationNoticeNotificationData = {
  storedProductUuid: string;
  remainingDays: number;
};

type NotificationData =
  | MessageNotificationData
  | ProductExpirationNoticeNotificationData;

export enum NotificationType {
  MESSAGE,
  PRODUCT_EXPIRATION_NOTICE,
}
export default class Notification
  extends IBaseModule<TableNames>
  implements IFirestoreObject
{
  static localTableName = LocalTable.NOTIFICATION;

  uuid: string;

  data: NotificationData;

  type: NotificationType;

  read: boolean;

  createdAt: string;

  ownerUid: string;

  firestoreCollectionName = Notification.getFirestoreCollectionName();

  firestoreDeletedCollectionName =
    Notification.getFirestoreDeletedCollectionName();

  updatedAt?: string;

  firestoreId?: string;

  constructor(
    uuid: string,
    data: NotificationData = { message: `notification ${uuid}` },
    type: NotificationType = NotificationType.MESSAGE,
    read = false,
    createdAt: string,
    ownerUid: string,
    id?: number,
    firestoreId?: string,
    updatedAt?: string
  ) {
    super(Notification.localTableName);
    this.uuid = uuid;
    this.data = data;
    this.type = type;
    this.read = read;
    this.createdAt = createdAt;
    this.ownerUid = ownerUid;

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

  getKey() {
    return `notification_${this.uuid}`;
  }

  get serialized(): string {
    return JSON.stringify(this.data);
  }

  set serialized(value: string) {
    this.data = JSON.parse(value);
  }

  public clone(override?: Partial<Notification>) {
    return new Notification(
      override?.uuid ?? this.uuid,
      override?.data ?? this.data,
      override?.type ?? this.type,
      override?.read ?? this.read,
      override?.createdAt ?? this.createdAt,
      override?.ownerUid ?? this.ownerUid,
      override?.id ?? this.id,
      override?.firestoreId ?? this.firestoreId,
      override?.updatedAt ?? this.updatedAt
    );
  }

  static GetTableStructor() {
    return TableBuilder<Notification, TableNames>(Notification.localTableName)
      .column("id")
      .primary.autoIncrement.number.column("uuid")
      .unique.string.column("serialized")
      .column("type")
      .number.column("ownerUid")
      .nullable.column("read")
      .boolean.column("createdAt")
      .column("updatedAt")
      .string.nullable.column("firestoreId")
      .string.nullable.objectPrototype(Notification.prototype);
  }

  static buildFromDatabaseResult(r: Notification): Notification {
    // todo is this necessary?
    //  if the component comes already build from the query, there's no need of this method at all.
    return new Notification(
      r.uuid,
      r.data,
      r.type,
      r.read,
      r.createdAt,
      r.ownerUid,
      r.id,
      r.firestoreId,
      r.updatedAt
    );
  }

  static getFirestoreCollectionName(): string {
    return "notification";
  }

  static getFirestoreDeletedCollectionName(): string {
    return "deleted_notification";
  }

  static buildFromFirestoreData(doc: DocumentData): Notification {
    return new Notification(
      doc.data().uuid,
      doc.data().data,
      doc.data().type,
      doc.data().read,
      doc.data().createdAt,
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
      ...sendToFirestoreData
    } = this;
    return sendToFirestoreData;
  }
}
