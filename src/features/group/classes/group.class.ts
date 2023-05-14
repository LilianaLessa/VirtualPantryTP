import { IBaseModule, TableBuilder } from "expo-sqlite-wrapper";
import {
  LocalTable,
  TableNames,
} from "../../../services/applicationData/localDatabase/tables";
import UserInGroup from "./user-in-group.class";

export default class Group extends IBaseModule<TableNames> {
  uuid: string;

  name: string;

  ownerUid: string;

  updatedAt?: string;

  firebaseDocId?: string;

  users: UserInGroup[];

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
    this.users = [];
  }

  // arrow functions cause unserializable value exception during navigation.
  public getKey(): string {
    return `group_${this.uuid}`;
  }

  public setUser(userInGroup: UserInGroup): void {
    const currentUser = this.users.find((u) => u.email === userInGroup.email);
    if (currentUser) {
      console.log("update current");
      currentUser.isAdmin = userInGroup.isAdmin;
      currentUser.isInviter = userInGroup.isInviter;
      currentUser.updatedAt = userInGroup.updatedAt;
      return;
    }
    console.log("add new");
    this.users.push(userInGroup);
  }

  public clone(override?: Partial<Group>) {
    const cloned = new Group(
      override?.uuid ?? this.uuid,
      override?.name ?? this.name,
      override?.ownerUid ?? this.ownerUid,
      override?.id ?? this.id,
      override?.firebaseDocId ?? this.firebaseDocId,
      override?.updatedAt ?? this.updatedAt
    );

    cloned.users = (override?.users ?? this.users).map((u) =>
      UserInGroup.clone(u)
    );
    return cloned;
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
