import IShoppingList from "../../features/shoppingList/interfaces/shopping-list.interface";
import { createMockShoppingLists } from "../../dev-utils";
import { ShoppingListsActions } from "../actions";
import { ShoppingListsActionType } from "../action-types";

interface ShoppingListsState {
  shoppingLists: Map<string, IShoppingList>;
}

const mockShoppingLists = new Map<string, IShoppingList>();

for (let i = 0; i < 3; i++) {
  const shoppingList = createMockShoppingLists();
  mockShoppingLists.set(shoppingList.uuid, shoppingList);
}

const initialState: ShoppingListsState = {
  shoppingLists: mockShoppingLists,
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
        action.newShoppingList.uuid,
        // eslint-disable-next-line comma-dangle
        action.newShoppingList
      );
      return { ...state, shoppingLists: new Map(state.shoppingLists) };
    case ShoppingListsActionType.DELETE_SHOPPING_LIST:
      state.shoppingLists.delete(action.shoppingListToDelete.uuid);
      return { ...state, shoppingLists: new Map(state.shoppingLists) };
    default:
      return state;
  }
};

export default shoppingListsReducer;
