import { ShoppingListsActions } from "../actions";
import ShoppingList from "../../features/shoppingList/classes/shopping-list.class";
import ShoppingListItem from "../../features/shoppingList/classes/shopping-list-item.class";
import { ShoppingListsActionType } from "../action-types";

interface ShoppingListsState {
  shoppingLists: Map<string, ShoppingList>;
  shoppingListItems: Map<string, ShoppingListItem>;
}

const initialState: ShoppingListsState = {
  shoppingLists: new Map<string, ShoppingList>(),
  shoppingListItems: new Map<string, ShoppingListItem>(),
};

const shoppingListsReducer = (
  // eslint-disable-next-line default-param-last
  state: ShoppingListsState = initialState,
  // eslint-disable-next-line comma-dangle
  action: ShoppingListsActions
): ShoppingListsState => {
  switch (action.type) {
    case ShoppingListsActionType.SAVE_SHOPPING_LIST:
      state.shoppingLists.set(
        action.shoppingList.uuid,
        // eslint-disable-next-line comma-dangle
        action.shoppingList
      );
      return { ...state, shoppingLists: new Map(state.shoppingLists) };
    case ShoppingListsActionType.DELETE_SHOPPING_LIST:
      state.shoppingLists.delete(action.shoppingList.uuid);
      return { ...state, shoppingLists: new Map(state.shoppingLists) };
    case ShoppingListsActionType.INIT_SHOPPING_LIST_COLLECTION:
      return {
        ...state,
        shoppingLists: action.shoppingLists.reduce(
          (map: Map<string, ShoppingList>, p: ShoppingList) =>
            map.set(p.uuid, p),
          new Map<string, ShoppingList>()
        ),
      };

    case ShoppingListsActionType.SAVE_SHOPPING_LIST_ITEM:
      state.shoppingListItems.set(
        action.shoppingListItem.uuid,
        // eslint-disable-next-line comma-dangle
        action.shoppingListItem
      );
      return { ...state, shoppingListItems: new Map(state.shoppingListItems) };
    case ShoppingListsActionType.DELETE_SHOPPING_LIST_ITEM:
      state.shoppingListItems.delete(action.shoppingListItem.uuid);
      return { ...state, shoppingListItems: new Map(state.shoppingListItems) };
    case ShoppingListsActionType.INIT_SHOPPING_LIST_ITEM_COLLECTION:
      return {
        ...state,
        shoppingListItems: action.shoppingListItems.reduce(
          (map: Map<string, ShoppingListItem>, p: ShoppingListItem) =>
            map.set(p.uuid, p),
          new Map<string, ShoppingListItem>()
        ),
      };

    default:
      return state;
  }
};

export default shoppingListsReducer;
