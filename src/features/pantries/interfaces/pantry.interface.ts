export interface IPantry {
  uuid: string;
  name: string;

  getKey: () => string;

  // clone: (override: Partial<IPantry>) => IPantry;
}
