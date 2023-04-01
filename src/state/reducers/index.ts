import { combineReducers } from "redux";
import savedProductsReducer from "./saved-products.reducer";
import apiActivityReducer from "./api-activity.reducer";
import messageSnackbarReducer from "./message-snackbar.reducer";
import pantriesReducer from "./pantries.reducer";

const reducers = combineReducers({
  savedProducts: savedProductsReducer,
  pantries: pantriesReducer,
  apiActivity: apiActivityReducer,
  messageSnackbar: messageSnackbarReducer,
});

export default reducers;

export type RootState = ReturnType<typeof reducers>;
