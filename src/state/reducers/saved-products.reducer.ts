import { IProduct } from "../../features/products/interfaces/product.interface";
import { SavedProductsActionType } from "../action-types";
import { SavedProductsActions } from "../actions";
import Product from "../../features/products/classes/product.class";

interface SavedProductsState {
  products: IProduct[];
}

const initialState: SavedProductsState = {
  products: [new Product("test1"), new Product("test2")],
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
