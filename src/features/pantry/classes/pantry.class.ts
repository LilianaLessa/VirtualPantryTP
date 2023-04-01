import { IPantry } from "../interfaces/pantry.interface";

export default class Pantry implements IPantry {
  uuid: string;

  name: string;

  constructor(uuid: string, name?: string) {
    this.uuid = uuid;
    this.name = name ?? "";
  }

  getKey(): string {
    return `pantry_${this.uuid}`;
  }

  // clone: (override: Partial<IPantry>) => IPantry;
}
