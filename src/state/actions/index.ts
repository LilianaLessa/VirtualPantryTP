import {
  ApiActivityActionType,
  NotificationsActionType,
  PantriesActionType,
  SavedProductsActionType,
  ShoppingListsActionType,
  StoredProductActionType,
} from "../action-types";
import { IProduct } from "../../features/products/interfaces/product.interface";
import { IPantry } from "../../features/pantries/interfaces/pantry.interface";
import { IStoredProduct } from "../../features/products/interfaces/stored-product.interface";
import { INotification } from "../../features/notification/interfaces/notification.interface";
import IShoppingList from "../../features/shoppingList/interfaces/shopping-list.interface";

interface SaveProductAction {
  type: SavedProductsActionType.SAVE_PRODUCT;
  newProduct: IProduct;
}

interface DeleteProductAction {
  type: SavedProductsActionType.DELETE_PRODUCT;
  productToDelete: IProduct;
}

export type SavedProductsActions = SaveProductAction | DeleteProductAction;

interface StoreProductAction {
  type: StoredProductActionType.STORE_PRODUCT;
  productToStore: IStoredProduct;
}

interface DeleteStoredProductAction {
  type: StoredProductActionType.DELETE_STORED_PRODUCT;
  storedProductToDelete: IStoredProduct;
}

export type StoredProductActions =
  | StoreProductAction
  | DeleteStoredProductAction;

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

interface AddNotification {
  type: NotificationsActionType.ADD_NOTIFICATION;
  newNotification: INotification;
}

interface RemoveNotification {
  type: NotificationsActionType.REMOVE_NOTIFICATION;
  notificationToRemove: INotification;
}

interface ReadNotification {
  type: NotificationsActionType.READ_NOTIFICATION;
  notificationToRead: INotification;
}

interface ClearNotifications {
  type: NotificationsActionType.CLEAR_NOTIFICATIONS;
}

export type NotificationsActions =
  | AddNotification
  | RemoveNotification
  | ReadNotification
  | ClearNotifications;

interface SaveShoppingList {
  type: ShoppingListsActionType.SAVE_SHOPPING_LIST;
  newShoppingList: IShoppingList;
}

interface DeleteShoppingList {
  type: ShoppingListsActionType.DELETE_SHOPPING_LIST;
  shoppingListToDelete: IShoppingList;
}

export type ShoppingListsActions = SaveShoppingList | DeleteShoppingList;
