export default interface IShoppingListItem {
  uuid: string;
  name: string;
  quantity: number;
  bought: boolean;
  boughtPrice: number;
  // product?: IProduct; //todo check if it is necessary.

  getKey: () => string;
}
