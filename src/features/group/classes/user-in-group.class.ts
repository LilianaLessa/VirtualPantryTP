import { IBaseModule, TableBuilder } from "expo-sqlite-wrapper";
import { DocumentData } from "firebase/firestore";
import {
  LocalTable,
  TableNames,
} from "../../../services/applicationData/localDatabase/tables";
import Product from "../../products/classes/product.class";
import IFirestoreObject from "../../../services/firebase/interfaces/firestore-object.interface";

export enum UseInGroupAcceptanceState {
  PENDING,
  VIEWED,
  ACCEPTED,
  REJECTED,
  LEFT,
}

export default class UserInGroup
  extends IBaseModule<TableNames>
  implements IFirestoreObject
{
  firestoreCollectionName = UserInGroup.getFirestoreCollectionName();

  firestoreDeletedCollectionName =
    UserInGroup.getFirestoreDeletedCollectionName();

  uuid: string;

  relationKey: string;

  email: string;

  groupUuid: string;

  isAdmin: boolean;

  isInviter: boolean;

  acceptanceState: UseInGroupAcceptanceState;

  answererUid: string;

  updatedAt?: string;

  ownerUid: string;

  firestoreId: string;

  constructor(
    uuid: string,
    ownerUid: string,
    groupUuid: string,
    email: string,
    isAdmin: boolean,
    isInviter: boolean,
    acceptanceState: UseInGroupAcceptanceState,
    answererUid?: string,
    id?: number,
    firestoreId?: string,
    updatedAt?: string
  ) {
    super(LocalTable.USER_IN_GROUP);
    this.uuid = uuid;
    this.ownerUid = ownerUid;
    this.groupUuid = groupUuid;
    this.email = email;
    this.isAdmin = isAdmin;
    this.isInviter = isInviter;
    this.acceptanceState = acceptanceState ?? UseInGroupAcceptanceState.PENDING;
    this.relationKey = UserInGroup.calculateRelationKey(this);
    if (typeof id !== "undefined") {
      this.id = id;
    }
    if (typeof updatedAt !== "undefined") {
      this.updatedAt = updatedAt;
    }
    if (typeof firestoreId !== "undefined") {
      this.firestoreId = firestoreId;
    }

    if (typeof answererUid !== "undefined") {
      this.answererUid = answererUid;
    }
  }

  getKey(): string {
    return `user_in_group_${this.uuid}`;
  }

  private static calculateRelationKey(userInGroup: UserInGroup): string {
    return `${userInGroup.email.toLowerCase()}_${userInGroup.groupUuid}`;
  }

  public static clone(userInGroup: UserInGroup): UserInGroup {
    return new UserInGroup(
      userInGroup.uuid,
      userInGroup.ownerUid,
      userInGroup.groupUuid,
      userInGroup.email,
      userInGroup.isAdmin,
      userInGroup.isInviter,
      userInGroup.acceptanceState,
      userInGroup.answererUid,
      userInGroup.id,
      userInGroup.firestoreId,
      userInGroup.updatedAt
    );
  }

  static GetTableStructor() {
    return TableBuilder<UserInGroup, TableNames>(LocalTable.USER_IN_GROUP)
      .column("id")
      .primary.autoIncrement.number.column("uuid")
      .unique.string.column("ownerUid")
      .column("relationKey")
      .unique.string.column("email")
      .column("groupUuid")
      .constrain<Product>("groupUuid", LocalTable.GROUP, "uuid")
      .column("isAdmin")
      .boolean.column("isInviter")
      .boolean.column("acceptanceState")
      .number.column("answererUid")
      .column("updatedAt")
      .string.nullable.column("firestoreId")
      .string.nullable.objectPrototype(UserInGroup.prototype);
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
    return "userInGroup";
  }

  static getFirestoreDeletedCollectionName(): string {
    return "deleted_UserInGroup";
  }

  static buildFromFirestoreData(doc: DocumentData): UserInGroup {
    return new UserInGroup(
      doc.data().uuid,
      doc.data().ownerUid,
      doc.data().groupUuid,
      doc.data().email,
      doc.data().isAdmin,
      doc.data().isInviter,
      doc.data().acceptanceState,
      doc.data().answererUid,
      undefined,
      doc.id,
      doc.data().updatedAt
    );
  }
}
