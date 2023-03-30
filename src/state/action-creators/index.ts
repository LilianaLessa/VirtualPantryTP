import { Dispatch } from "redux";
import { IProduct } from "../../features/products/interfaces/product.interface";
import { SavedProductsActionType } from "../action-types";
import { SavedProductsActions } from "../actions";

/**
 * todo maybe these actions shouldn't be interfaces, but classes?
 *     this way, the client wouldn't need to take care of setting the correct action.
 */

// eslint-disable-next-line operator-linebreak
export const saveProduct =
  (product: IProduct) => (dispatch: Dispatch<SavedProductsActions>) => {
    dispatch({
      type: SavedProductsActionType.SAVE_PRODUCT,
      newProduct: product,
    });
  };

// eslint-disable-next-line operator-linebreak
export const deleteProduct =
  (product: IProduct) => (dispatch: Dispatch<SavedProductsActions>) => {
    dispatch({
      type: SavedProductsActionType.DELETE_PRODUCT,
      productToDelete: product,
    });
  };
