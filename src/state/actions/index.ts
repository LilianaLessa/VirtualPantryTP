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

interface InitProductCollectionAction {
  type: SavedProductsActionType.INIT_COLLECTION;
  productCollection: IProduct[];
}

export type SavedProductsActions =
  | SaveProductAction
  | DeleteProductAction
  | InitProductCollectionAction;

interface StoreProductAction {
  type: StoredProductActionType.STORE_PRODUCT;
  productToStore: IStoredProduct;
}

interface DeleteStoredProductAction {
  type: StoredProductActionType.DELETE_STORED_PRODUCT;
  storedProductToDelete: IStoredProduct;
}
interface InitStoredProductCollectionAction {
  type: StoredProductActionType.INIT_STORED_PRODUCT_COLLECTION;
  storedProductCollection: IStoredProduct[];
}

export type StoredProductActions =
  | StoreProductAction
  | InitStoredProductCollectionAction
  | DeleteStoredProductAction;

interface SavePantryAction {
  type: PantriesActionType.SAVE_PANTRY;
  newPantry: IPantry;
}

interface DeletePantryAction {
  type: PantriesActionType.DELETE_PANTRY;
  pantryToDelete: IPantry;
}

interface InitPantryCollectionAction {
  type: PantriesActionType.INIT_PANTRY_COLLECTION;
  pantryCollection: IPantry[];
}

export type PantriesActions =
  | SavePantryAction
  | DeletePantryAction
  | InitPantryCollectionAction;

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
