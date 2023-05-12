export interface IPantry {
  id: number;
  uuid: string;
  name: string;
  ownerUid?: string;

  getKey: () => string;
}
