export interface IPantry {
  id: number;
  uuid: string;
  name: string;

  getKey: () => string;
}
