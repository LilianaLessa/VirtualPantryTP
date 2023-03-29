// eslint-disable-next-line import/no-extraneous-dependencies
import { Dispatch } from "redux";
import { IProduct } from "../../features/products/interfaces/product.interface";
import { SavedProductsActionType } from "../action-types";
import { SavedProductsActions } from "../actions";

// eslint-disable-next-line operator-linebreak,import/prefer-default-export
export const saveProduct =
  (product: IProduct) => (dispatch: Dispatch<SavedProductsActions>) => {
    dispatch({
      type: SavedProductsActionType.SAVE_PRODUCT,
      newProduct: product,
    });
  };
