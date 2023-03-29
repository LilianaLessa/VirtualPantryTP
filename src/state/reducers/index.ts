// eslint-disable-next-line import/no-extraneous-dependencies
import { combineReducers } from "redux";
import savedProductsReducer from "./saved-products.reducer";

const reducers = combineReducers({
  savedProducts: savedProductsReducer,
});

export default reducers;

export type RootState = ReturnType<typeof reducers>;
