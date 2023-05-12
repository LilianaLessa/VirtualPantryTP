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

  constructor(uuid: string, name?: string, id?: number, ownerUid?: string) {
    super(LocalTable.PANTRY);
    this.uuid = uuid;
    this.name = name ?? "";
    if (typeof id !== "undefined") {
      this.id = id;
    }
    if (typeof ownerUid !== "undefined") {
      this.ownerUid = ownerUid;
    }
  }

  getKey(): string {
    return `pantry_${this.uuid}`;
  }

  static GetTableStructor() {
    return TableBuilder<Pantry, TableNames>(LocalTable.PANTRY)
      .column("id")
      .primary.autoIncrement.number.column("uuid")
      .column("name")
      .column("ownerUid")
      .string.nullable.objectPrototype(Pantry.prototype);
  }
}
