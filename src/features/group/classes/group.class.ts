import { IBaseModule, TableBuilder } from "expo-sqlite-wrapper";
import {
  LocalTable,
  TableNames,
} from "../../../services/applicationData/localDatabase/tables";

export default class Group extends IBaseModule<TableNames> {
  uuid: string;

  name: string;

  ownerUid: string;

  updatedAt?: string;

  firebaseDocId?: string;

  constructor(
    uuid: string,
    name: string,
    ownerUid: string,
    id?: number,
    firebaseDocId?: string,
    updatedAt?: string
  ) {
    super(LocalTable.GROUP);
    this.uuid = uuid;
    this.name = name;
    this.ownerUid = ownerUid;
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

  // arrow functions cause unserializable value exception during navigation.
  public getKey(): string {
    return `group_${this.uuid}`;
  }

  static GetTableStructor() {
    return TableBuilder<Group, TableNames>(LocalTable.GROUP)
      .column("id")
      .primary.autoIncrement.number.column("uuid")
      .unique.string.column("name")
      .column("ownerUid")
      .string.nullable.column("updatedAt")
      .string.nullable.column("firebaseDocId")
      .string.nullable.objectPrototype(Group.prototype);
  }
}
