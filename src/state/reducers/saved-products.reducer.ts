import { IProduct } from "../../features/products/interfaces/product.interface";
import { SavedProductsActionType } from "../action-types";
import { SavedProductsActions } from "../actions";
import { createMockProduct } from "../../dev-utils";

interface SavedProductsState {
  products: IProduct[];
}

const initialState: SavedProductsState = {
  products: [createMockProduct(), createMockProduct()],
};

const savedProductsReducer = (
  // eslint-disable-next-line default-param-last
  state: SavedProductsState = initialState,
  // eslint-disable-next-line comma-dangle
  action: SavedProductsActions
): SavedProductsState => {
  switch (action.type) {
    case SavedProductsActionType.SAVE_PRODUCT:
      return { products: [...state.products, action.newProduct] };
    default:
      return state;
  }
};

export default savedProductsReducer;
