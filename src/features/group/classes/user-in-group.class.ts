import { IBaseModule, TableBuilder } from "expo-sqlite-wrapper";
import {
  LocalTable,
  TableNames,
} from "../../../services/applicationData/localDatabase/tables";
import Group from "./group.class";
import Product from "../../products/classes/product.class";

export default class UserInGroup extends IBaseModule<TableNames> {
  uuid: string;

  relationKey: string;

  email: string;

  groupId: number;

  group: Group;

  isAdmin: boolean;

  isInviter: boolean;

  updatedAt?: string;

  firebaseDocId?: string;

  constructor(
    uuid: string,
    email: string,
    group: Group,
    isAdmin: boolean,
    isInviter: boolean,
    id?: number,
    firebaseDocId?: string,
    updatedAt?: string
  ) {
    super(LocalTable.USER_IN_GROUP);
    this.uuid = uuid;
    this.email = email;
    this.group = group;
    this.groupId = group.id;
    this.isAdmin = isAdmin;
    this.isInviter = isInviter;
    this.relationKey = UserInGroup.calculateRelationKey(this);
    if (typeof id !== "undefined") {
      this.id = id;
    }
    if (typeof updatedAt !== "undefined") {
      this.updatedAt = updatedAt;
    }
    if (typeof firebaseDocId !== "undefined") {
      this.updatedAt = firebaseDocId;
    }
  }

  getKey = (): string => `user_in_group_${this.uuid}`;

  private static calculateRelationKey(userInGroup: UserInGroup): string {
    return `${userInGroup.email.toLowerCase()}_${userInGroup.group.uuid}`;
  }

  static GetTableStructor() {
    return TableBuilder<UserInGroup, TableNames>(LocalTable.USER_IN_GROUP)
      .column("id")
      .primary.autoIncrement.number.column("uuid")
      .unique.string.column("relationKey")
      .unique.string.column("email")
      .column("groupId")
      .number.constrain<Product>("groupId", LocalTable.GROUP, "id")
      .column("isAdmin")
      .boolean.column("isInviter")
      .boolean.column("updatedAt")
      .string.nullable.column("firebaseDocId")
      .string.nullable.objectPrototype(UserInGroup.prototype);
  }
}
