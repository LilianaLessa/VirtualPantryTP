import { combineReducers } from "redux";
import savedProductsReducer from "./saved-products.reducer";
import apiActivityReducer from "./api-activity.reducer";
import messageSnackbarReducer from "./message-snackbar.reducer";
import pantriesReducer from "./pantries.reducer";
import storedProductsReducer from "./stored-products.reducer";
import notificationsReducer from "./notifications.reducer";
import shoppingListsReducer from "./shopping-lists.reducer";
import groupsReducer from "./group.reducer";

const reducers = combineReducers({
  savedProducts: savedProductsReducer,
  storedProducts: storedProductsReducer,
  pantries: pantriesReducer,
  apiActivity: apiActivityReducer,
  messageSnackbar: messageSnackbarReducer,
  notifications: notificationsReducer,
  shoppingLists: shoppingListsReducer,
  groups: groupsReducer,
});

export default reducers;

export type RootState = ReturnType<typeof reducers>;
