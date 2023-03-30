import { combineReducers } from "redux";
import savedProductsReducer from "./saved-products.reducer";
import apiActivityReducer from "./api-activity.reducer";

const reducers = combineReducers({
  savedProducts: savedProductsReducer,
  apiActivity: apiActivityReducer,
});

export default reducers;

export type RootState = ReturnType<typeof reducers>;
