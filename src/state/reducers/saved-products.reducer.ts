// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { IProduct } from "../../features/products/interfaces/product.interface";
import { SavedProductsActionType } from "../action-types";
import { SavedProductsActions } from "../actions";

import Product from "../../features/products/classes/product.class";
import DbContext from "../../services/applicationData/localDatabase/classes/db-context.class";

interface SavedProductsState {
  savedProducts: Map<string, IProduct>;
}

const initialState: SavedProductsState = {
  savedProducts: new Map<string, IProduct>(),
};

const savedProductsReducer = (
  // eslint-disable-next-line default-param-last
  state: SavedProductsState = initialState,
  // eslint-disable-next-line comma-dangle
  action: SavedProductsActions
): SavedProductsState => {
  switch (action.type) {
    case SavedProductsActionType.SAVE_PRODUCT:
      DbContext.getInstance()
        .database.save(action.newProduct as Product)
        .then(() => {
          // console.log("Product Persisted. Id:", action.newProduct.id);
        })
        .catch(() => {
          // console.log("Product persisting error");
        });
      state.savedProducts.set(action.newProduct.uuid, action.newProduct);
      return { ...state, savedProducts: new Map(state.savedProducts) };
    case SavedProductsActionType.DELETE_PRODUCT:
      DbContext.getInstance()
        .database.delete(action.productToDelete as Product)
        .then(() => {
          // console.log("Product deleted");
        })
        .catch(() => {
          // console.log("Product deletion error");
        });
      state.savedProducts.delete(action.productToDelete.uuid);
      return { ...state, savedProducts: new Map(state.savedProducts) };
    case SavedProductsActionType.INIT_COLLECTION:
      return {
        ...state,
        savedProducts: action.productCollection.reduce(
          (map: Map<string, IProduct>, p: IProduct) => map.set(p.uuid, p),
          new Map<string, IProduct>()
        ),
      };
    default:
      return state;
  }
};

export default savedProductsReducer;
