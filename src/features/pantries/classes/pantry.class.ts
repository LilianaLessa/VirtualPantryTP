import { IBaseModule, TableBuilder } from "expo-sqlite-wrapper";
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

  constructor(
    uuid: string,
    name?: string,
    id?: number,
    ownerUid?: string,
    updatedAt?: string
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
      override?.updatedAt ?? this.updatedAt
    );
  }

  static GetTableStructor() {
    return TableBuilder<Pantry, TableNames>(LocalTable.PANTRY)
      .column("id")
      .primary.autoIncrement.number.column("uuid")
      .column("name")
      .column("ownerUid")
      .string.nullable.column("updatedAt")
      .string.nullable.objectPrototype(Pantry.prototype);
  }
}
