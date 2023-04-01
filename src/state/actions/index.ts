import {
  ApiActivityActionType,
  PantriesActionType,
  SavedProductsActionType,
} from "../action-types";
import { IProduct } from "../../features/products/interfaces/product.interface";
import { IPantry } from "../../features/pantries/interfaces/pantry.interface";

interface SaveProductAction {
  type: SavedProductsActionType.SAVE_PRODUCT;
  newProduct: IProduct;
}

interface DeleteProductAction {
  type: SavedProductsActionType.DELETE_PRODUCT;
  productToDelete: IProduct;
}

export type SavedProductsActions = SaveProductAction | DeleteProductAction;

interface SavePantryAction {
  type: PantriesActionType.SAVE_PANTRY;
  newPantry: IPantry;
}

interface DeletePantryAction {
  type: PantriesActionType.DELETE_PANTRY;
  pantryToDelete: IPantry;
}

export type PantriesActions = SavePantryAction | DeletePantryAction;

interface DataFetchingStarted {
  type: ApiActivityActionType.DATA_FETCHING_STARTED;
}

interface DataFetchingFinished {
  type: ApiActivityActionType.DATA_FETCHING_FINISHED;
}

export type ApiActivityActions = DataFetchingStarted | DataFetchingFinished;

interface ShowError {
  type: "show_error";
  errorMessage: string;
}

interface HideError {
  type: "hide_error";
}

interface ShowInfo {
  type: "show_info";
  infoMessage: string;
}

interface HideInfo {
  type: "hide_info";
}

export type MessageSnackbarActions =
  | ShowError
  | HideError
  | ShowInfo
  | HideInfo;
