import { Dispatch } from "redux";
import { IProduct } from "../../features/products/interfaces/product.interface";
import {
  MessageSnackbarActionType,
  SavedProductsActionType,
} from "../action-types";
import { MessageSnackbarActions, SavedProductsActions } from "../actions";

/**
 * todo maybe these actions shouldn't be interfaces, but classes?
 *     this way, the client wouldn't need to take care of setting the correct action.
 */

// eslint-disable-next-line operator-linebreak
export const saveProduct =
  (product: IProduct) =>
  (dispatch: Dispatch<SavedProductsActions | MessageSnackbarActions>) => {
    dispatch({
      type: MessageSnackbarActionType.SHOW_INFO,
      infoMessage: `Product '${product.name}' saved.`,
    });
    dispatch({
      type: SavedProductsActionType.SAVE_PRODUCT,
      newProduct: product,
    });
  };

// eslint-disable-next-line operator-linebreak
export const deleteProduct =
  (product: IProduct) =>
  (dispatch: Dispatch<SavedProductsActions | MessageSnackbarActions>) => {
    dispatch({
      type: MessageSnackbarActionType.SHOW_INFO,
      infoMessage: `Product '${product.name}' removed.`,
    });
    dispatch({
      type: SavedProductsActionType.DELETE_PRODUCT,
      productToDelete: product,
    });
  };

// eslint-disable-next-line operator-linebreak
export const showErrorSnack =
  (errorMessage: string) => (dispatch: Dispatch<MessageSnackbarActions>) => {
    dispatch({
      type: MessageSnackbarActionType.SHOW_ERROR,
      errorMessage,
    });
  };

// eslint-disable-next-line operator-linebreak
export const showInfoSnack =
  (infoMessage: string) => (dispatch: Dispatch<MessageSnackbarActions>) => {
    dispatch({
      type: MessageSnackbarActionType.SHOW_INFO,
      infoMessage,
    });
  };

// eslint-disable-next-line operator-linebreak
export const hideErrorSnack =
  () => (dispatch: Dispatch<MessageSnackbarActions>) => {
    dispatch({
      type: MessageSnackbarActionType.HIDE_ERROR,
    });
  };

// eslint-disable-next-line operator-linebreak
export const hideInfoSnack =
  () => (dispatch: Dispatch<MessageSnackbarActions>) => {
    dispatch({
      type: MessageSnackbarActionType.HIDE_INFO,
    });
  };
