export interface IProduct {
  name: string;
  uuid: string;

  getKey: () => string;
}
