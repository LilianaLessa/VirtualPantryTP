export default interface IShoppingListItem {
  name: string;
  quantity: number;
  bought: boolean;
  boughtPrice: number;
  // product?: IProduct; //todo check if it is necessary.
}
