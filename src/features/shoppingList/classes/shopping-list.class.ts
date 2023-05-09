import IShoppingList from "../interfaces/shopping-list.interface";
import IShoppingListItem from "../interfaces/shopping-list-item.interface";

export default class ShoppingList implements IShoppingList {
  uuid: string;

  name: string;

  items: IShoppingListItem[];

  constructor(uuid: string, name: string, items: IShoppingListItem[]) {
    this.uuid = uuid;
    this.name = name;
    this.items = items;
  }

  getKey(): string {
    return `shopping_list_${this.uuid}`;
  }
}
