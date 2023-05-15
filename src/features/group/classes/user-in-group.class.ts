import { IBaseModule, TableBuilder } from "expo-sqlite-wrapper";
import { DocumentData } from "firebase/firestore";
import {
  LocalTable,
  TableNames,
} from "../../../services/applicationData/localDatabase/tables";
import Product from "../../products/classes/product.class";
import IFirestoreObject from "../../../services/firebase/interfaces/firestore-object.interface";

export default class UserInGroup
  extends IBaseModule<TableNames>
  implements IFirestoreObject
{
  firestoreCollectionName = "userInGroup";

  firestoreDeletedCollectionName = "deleted_userInGroup";

  uuid: string;

  relationKey: string;

  email: string;

  groupUuid: string;

  isAdmin: boolean;

  isInviter: boolean;

  updatedAt?: string;

  firestoreId?: string;

  ownerUid: string;

  constructor(
    uuid: string,
    ownerUid: string,
    groupUuid: string,
    email: string,
    isAdmin: boolean,
    isInviter: boolean,
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
      .boolean.column("updatedAt")
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
    return "deletedUserInGroup";
  }

  static buildFromFirestoreData(doc: DocumentData): UserInGroup {
    return new UserInGroup(
      doc.data().uuid,
      doc.data().ownerUid,
      doc.data().groupUuid,
      doc.data().email,
      doc.data().isAdmin,
      doc.data().isInviter,
      undefined,
      doc.id,
      doc.data().updatedAt
    );
  }
}
