import IShoppingListItem from "../interfaces/shopping-list-item.interface";

export default class ShoppingListItem implements IShoppingListItem {
  uuid: string;

  name: string;

  quantity: number;

  bought: boolean;

  boughtPrice: number;

  constructor(
    uuid: string,
    name?: string,
    quantity?: number,
    bought?: boolean,
    boughtPrice?: number
  ) {
    this.uuid = uuid;
    this.name = name ?? "";
    this.quantity = quantity ?? 0;
    this.bought = bought ?? false;
    this.boughtPrice = boughtPrice ?? 0;
  }

  getKey(): string {
    return `shopping_list_item_${this.uuid}`;
  }
}
