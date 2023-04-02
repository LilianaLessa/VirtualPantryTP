import { Dispatch } from "redux";
import { IProduct } from "../../features/products/interfaces/product.interface";
import {
  MessageSnackbarActionType,
  PantriesActionType,
  SavedProductsActionType,
} from "../action-types";
import {
  MessageSnackbarActions,
  PantriesActions,
  SavedProductsActions,
} from "../actions";
import { IPantry } from "../../features/pantries/interfaces/pantry.interface";

/**
 * todo maybe these actions shouldn't be interfaces, but classes?
 *     this way, the client wouldn't need to take care of setting the correct action.
 */

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

// todo when deleting a product, what should happen with the stored ones?
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
export const savePantry =
  (pantry: IPantry, saveMessaged?: string) =>
  (dispatch: Dispatch<PantriesActions | MessageSnackbarActions>) => {
    dispatch({
      type: MessageSnackbarActionType.SHOW_INFO,
      infoMessage: saveMessaged ?? `Pantry '${pantry.name}' saved.`,
    });
    dispatch({
      type: PantriesActionType.SAVE_PANTRY,
      newPantry: pantry,
    });
  };

// eslint-disable-next-line operator-linebreak
export const deletePantry =
  (pantry: IPantry) =>
  (dispatch: Dispatch<PantriesActions | MessageSnackbarActions>) => {
    dispatch({
      type: MessageSnackbarActionType.SHOW_INFO,
      infoMessage: `Pantry '${pantry.name}' removed.`,
    });
    dispatch({
      type: PantriesActionType.DELETE_PANTRY,
      pantryToDelete: pantry,
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
