export interface IPantry {
  uuid: string;
  name: string;

  getKey: () => string;
}
