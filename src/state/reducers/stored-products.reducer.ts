import { StoredProductActionType } from "../action-types";
import { StoredProductActions } from "../actions";
import StoredProduct from "../../features/products/classes/stored.product";

interface StoredProductsState {
  storedProducts: Map<string, StoredProduct>;
}

const initialState: StoredProductsState = {
  storedProducts: new Map<string, StoredProduct>(),
};

const StoredProductsReducer = (
  // eslint-disable-next-line default-param-last
  state: StoredProductsState = initialState,
  // eslint-disable-next-line comma-dangle
  action: StoredProductActions
): StoredProductsState => {
  switch (action.type) {
    case StoredProductActionType.STORE_PRODUCT:
      state.storedProducts.set(action.storedProduct.uuid, action.storedProduct);
      return { ...state, storedProducts: new Map(state.storedProducts) };
    case StoredProductActionType.DELETE_STORED_PRODUCT:
      state.storedProducts.delete(action.storedProduct.uuid);
      return { ...state, storedProducts: new Map(state.storedProducts) };
    case StoredProductActionType.INIT_STORED_PRODUCT_COLLECTION:
      return {
        ...state,
        storedProducts: action.storedProductCollection.reduce(
          (map: Map<string, StoredProduct>, p: StoredProduct) =>
            map.set(p.uuid, p),
          new Map<string, StoredProduct>()
        ),
      };
    default:
      return state;
  }
};

export default StoredProductsReducer;
