import {
  ApiActivityActionType,
  GroupsActionType,
  NotificationsActionType,
  PantriesActionType,
  SavedProductsActionType,
  ShoppingListsActionType,
  StoredProductActionType,
} from "../action-types";
import { IProduct } from "../../features/products/interfaces/product.interface";
import { IPantry } from "../../features/pantries/interfaces/pantry.interface";
import { INotification } from "../../features/notification/interfaces/notification.interface";
import Group from "../../features/group/classes/group.class";
import StoredProduct from "../../features/products/classes/stored.product";
import ShoppingList from "../../features/shoppingList/classes/shopping-list.class";
import ShoppingListItem from "../../features/shoppingList/classes/shopping-list-item.class";

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
  storedProduct: StoredProduct;
}

interface DeleteStoredProductAction {
  type: StoredProductActionType.DELETE_STORED_PRODUCT;
  storedProduct: StoredProduct;
}
interface InitStoredProductCollectionAction {
  type: StoredProductActionType.INIT_STORED_PRODUCT_COLLECTION;
  storedProductCollection: StoredProduct[];
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
  shoppingList: ShoppingList;
}

interface DeleteShoppingList {
  type: ShoppingListsActionType.DELETE_SHOPPING_LIST;
  shoppingList: ShoppingList;
}

interface InitShoppingListCollection {
  type: ShoppingListsActionType.INIT_SHOPPING_LIST_COLLECTION;
  shoppingLists: ShoppingList[];
}

interface SaveShoppingListItem {
  type: ShoppingListsActionType.SAVE_SHOPPING_LIST_ITEM;
  shoppingListItem: ShoppingListItem;
}

interface DeleteShoppingListItem {
  type: ShoppingListsActionType.DELETE_SHOPPING_LIST_ITEM;
  shoppingListItem: ShoppingListItem;
}

interface InitShoppingListItemCollection {
  type: ShoppingListsActionType.INIT_SHOPPING_LIST_ITEM_COLLECTION;
  shoppingListItems: ShoppingListItem[];
}

export type ShoppingListsActions =
  | SaveShoppingList
  | DeleteShoppingList
  | InitShoppingListCollection
  | SaveShoppingListItem
  | DeleteShoppingListItem
  | InitShoppingListItemCollection;

interface SaveGroupAction {
  type: GroupsActionType.SAVE_GROUP;
  group: Group;
}

interface DeleteGroupAction {
  type: GroupsActionType.DELETE_GROUP;
  group: Group;
}

interface InitGroupCollectionAction {
  type: GroupsActionType.INIT_GROUP_COLLECTION;
  groupCollection: Group[];
}

export type GroupsActions =
  | SaveGroupAction
  | DeleteGroupAction
  | InitGroupCollectionAction;
