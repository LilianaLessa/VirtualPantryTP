import IShoppingListItem from "./shopping-list-item.interface";

export default interface IShoppingList {
  uuid: string;
  name: string;
  items: IShoppingListItem[];

  getKey: () => string;
}
