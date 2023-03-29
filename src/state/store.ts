// eslint-disable-next-line import/no-extraneous-dependencies
import { applyMiddleware, createStore } from "redux";
// eslint-disable-next-line import/no-extraneous-dependencies
import thunk from "redux-thunk";
import reducers from "./reducers";

// eslint-disable-next-line import/prefer-default-export
export const store = createStore(reducers, {}, applyMiddleware(thunk));
