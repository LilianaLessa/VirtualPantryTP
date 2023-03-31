import { IProduct } from "../../features/products/interfaces/product.interface";
import { SavedProductsActionType } from "../action-types";
import { SavedProductsActions } from "../actions";
import { createMockProduct } from "../../dev-utils";

interface SavedProductsState {
  products: Map<string, IProduct>;
}

const mockProducts = new Map<string, IProduct>();

for (let i = 0; i < 2; i++) {
  const product = createMockProduct();
  mockProducts.set(product.uuid, product);
}

const initialState: SavedProductsState = {
  products: mockProducts,
};

const savedProductsReducer = (
  // eslint-disable-next-line default-param-last
  state: SavedProductsState = initialState,
  // eslint-disable-next-line comma-dangle
  action: SavedProductsActions
): SavedProductsState => {
  switch (action.type) {
    case SavedProductsActionType.SAVE_PRODUCT:
      state.products.set(action.newProduct.uuid, action.newProduct);
      return { ...state, products: new Map(state.products) };
    case SavedProductsActionType.DELETE_PRODUCT:
      state.products.delete(action.productToDelete.uuid);
      return { ...state, products: new Map(state.products) };
    default:
      return state;
  }
};

export default savedProductsReducer;
