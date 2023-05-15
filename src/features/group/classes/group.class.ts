import { IBaseModule, TableBuilder } from "expo-sqlite-wrapper";
import firebase from "firebase/compat";
import {
  LocalTable,
  TableNames,
} from "../../../services/applicationData/localDatabase/tables";
import UserInGroup from "./user-in-group.class";
import IFirestoreObject from "../../../services/firebase/interfaces/firestore-object.interface";
import DocumentData = firebase.firestore.DocumentData;

export default class Group
  extends IBaseModule<TableNames>
  implements IFirestoreObject
{
  uuid: string;

  name: string;

  ownerUid: string;

  users: UserInGroup[];

  firestoreCollectionName = Group.getFirestoreCollectionName();

  firestoreDeletedCollectionName = Group.getFirestoreDeletedCollectionName();

  updatedAt?: string;

  firestoreId?: string;

  constructor(
    uuid: string,
    name: string,
    ownerUid: string,
    id?: number,
    firestoreId?: string,
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
    if (typeof firestoreId !== "undefined") {
      this.firestoreId = firestoreId;
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
      // console.log("update current");
      currentUser.isAdmin = userInGroup.isAdmin;
      currentUser.isInviter = userInGroup.isInviter;
      currentUser.updatedAt = userInGroup.updatedAt;
      return;
    }
    // console.log("add new");
    this.users.push(userInGroup);
  }

  public clone(override?: Partial<Group>) {
    const cloned = new Group(
      override?.uuid ?? this.uuid,
      override?.name ?? this.name,
      override?.ownerUid ?? this.ownerUid,
      override?.id ?? this.id,
      override?.firestoreId ?? this.firestoreId,
      override?.updatedAt ?? this.updatedAt
    );

    cloned.users = (override?.users ?? this.users).map((u) =>
      UserInGroup.clone(u)
    );
    return cloned;
  }

  getFirestoreData(): object {
    const {
      id,
      tableName,
      firestoreCollectionName,
      firestoreDeletedCollectionName,
      users,
      firestoreId,
      ...data
    } = this;
    return data;
  }

  static GetTableStructor() {
    return TableBuilder<Group, TableNames>(LocalTable.GROUP)
      .column("id")
      .primary.autoIncrement.number.column("uuid")
      .unique.string.column("name")
      .column("ownerUid")
      .column("updatedAt")
      .string.nullable.column("firestoreId")
      .string.nullable.objectPrototype(Group.prototype);
  }

  static getFirestoreCollectionName(): string {
    return "group";
  }

  static getFirestoreDeletedCollectionName(): string {
    return "deletedGroup";
  }

  static buildFromFirestoreData(doc: DocumentData): Group {
    return new Group(
      doc.data().uuid,
      doc.data().name,
      doc.data().ownerUid,
      undefined,
      doc.id,
      doc.data().updatedAt
    );
  }
}
