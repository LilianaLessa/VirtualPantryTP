import { IBaseModule, TableBuilder } from "expo-sqlite-wrapper";
import { IPantry } from "../interfaces/pantry.interface";
import {
  LocalTable,
  TableNames,
} from "../../../services/applicationData/localDatabase/tables";

export default class Pantry extends IBaseModule<TableNames> implements IPantry {
  uuid: string;

  name: string;

  constructor(uuid: string, name?: string) {
    super(LocalTable.PANTRY);
    this.uuid = uuid;
    this.name = name ?? "";
  }

  getKey(): string {
    return `pantry_${this.uuid}`;
  }

  static GetTableStructor() {
    return TableBuilder<Pantry, TableNames>(LocalTable.PANTRY)
      .column("id")
      .primary.autoIncrement.number.column("uuid")
      .column("name")
      .objectPrototype(Pantry.prototype);
  }
}
