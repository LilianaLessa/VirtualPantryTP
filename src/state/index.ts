import * as actionCreators from "./action-creators";

export * from "./store";
export * from "./reducers";

/**
 * to solve
 * Export namespace should be first transformed by `@babel/plugin-proposal-export-namespace-from`.
 * @see https://stackoverflow.com/questions/61718768/how-can-i-export-as-namespace-in-babel
 */
export { actionCreators };
