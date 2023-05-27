import { Dispatch } from "redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IProduct } from "../../features/products/interfaces/product.interface";
import {
  ApiActivityActionType,
  GroupsActionType,
  MessageSnackbarActionType,
  NotificationsActionType,
  PantriesActionType,
  SavedProductsActionType,
  ShoppingListsActionType,
  StoredProductActionType,
} from "../action-types";
import {
  ApiActivityActions,
  GroupsActions,
  MessageSnackbarActions,
  NotificationsActions,
  PantriesActions,
  SavedProductsActions,
  ShoppingListsActions,
  StoredProductActions,
} from "../actions";
import { IPantry } from "../../features/pantries/interfaces/pantry.interface";
import Group from "../../features/group/classes/group.class";
import StoredProduct from "../../features/products/classes/stored.product";
import ShoppingList from "../../features/shoppingList/classes/shopping-list.class";
import ShoppingListItem from "../../features/shoppingList/classes/shopping-list-item.class";
import Notification from "../../features/notification/classes/notification.class";

/**
 * todo maybe these actions shouldn't be interfaces, but classes?
 *     this way, the client wouldn't need to take care of setting the correct action.
 */

export const saveProduct =
  (product: IProduct) => (dispatch: Dispatch<SavedProductsActions>) => {
    dispatch({
      type: SavedProductsActionType.SAVE_PRODUCT,
      newProduct: product,
    });
  };

export const saveProductInSilent =
  (product: IProduct) => (dispatch: Dispatch<SavedProductsActions>) => {
    AsyncStorage.getItem("@loggedUser").then((result) => {
      const storedUser = result ? JSON.parse(result) : null;
      // console.log(storedUser?.uid, product.ownerUid);
      if (storedUser !== null && typeof product.ownerUid === "undefined") {
        product.ownerUid = storedUser.uid;
      }
      dispatch({
        type: SavedProductsActionType.SAVE_PRODUCT,
        newProduct: product,
      });
    });
  };

// todo when deleting a product, what should happen with the stored ones?
// eslint-disable-next-line operator-linebreak
export const deleteProduct =
  (product: IProduct) => (dispatch: Dispatch<SavedProductsActions>) => {
    dispatch({
      type: SavedProductsActionType.DELETE_PRODUCT,
      productToDelete: product,
    });
  };

export const deleteProductInSilent =
  (product: IProduct) => (dispatch: Dispatch<SavedProductsActions>) => {
    dispatch({
      type: SavedProductsActionType.DELETE_PRODUCT,
      productToDelete: product,
    });
  };

export const initProductCollection =
  (productCollection: IProduct[]) =>
  (dispatch: Dispatch<SavedProductsActions>) => {
    dispatch({
      type: SavedProductsActionType.INIT_COLLECTION,
      productCollection,
    });
  };

// eslint-disable-next-line operator-linebreak
export const savePantry =
  (pantry: IPantry) => (dispatch: Dispatch<PantriesActions>) => {
    dispatch({
      type: PantriesActionType.SAVE_PANTRY,
      newPantry: pantry,
    });
  };

// eslint-disable-next-line operator-linebreak
export const deletePantry =
  (pantry: IPantry) => (dispatch: Dispatch<PantriesActions>) => {
    dispatch({
      type: PantriesActionType.DELETE_PANTRY,
      pantryToDelete: pantry,
    });
  };

export const initPantryCollection =
  (pantryCollection: IPantry[]) => (dispatch: Dispatch<PantriesActions>) => {
    dispatch({
      type: PantriesActionType.INIT_PANTRY_COLLECTION,
      pantryCollection,
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

export const storeProduct =
  (storedProduct: StoredProduct) =>
  (dispatch: Dispatch<StoredProductActions>) => {
    dispatch({
      type: StoredProductActionType.STORE_PRODUCT,
      storedProduct,
    });
  };

export const deleteStoredProduct =
  (storedProduct: StoredProduct) =>
  (dispatch: Dispatch<StoredProductActions>) => {
    dispatch({
      type: StoredProductActionType.DELETE_STORED_PRODUCT,
      storedProduct,
    });
  };

export const initStoredProductCollection =
  (storedProductCollection: StoredProduct[]) =>
  (dispatch: Dispatch<StoredProductActions>) => {
    dispatch({
      type: StoredProductActionType.INIT_STORED_PRODUCT_COLLECTION,
      storedProductCollection,
    });
  };

export const saveNotification =
  (notification: Notification) =>
  (dispatch: Dispatch<NotificationsActions>) => {
    dispatch({
      type: NotificationsActionType.ADD_NOTIFICATION,
      notification,
    });
  };

export const deleteNotification =
  (notification: Notification) =>
  (dispatch: Dispatch<NotificationsActions>) => {
    dispatch({
      type: NotificationsActionType.REMOVE_NOTIFICATION,
      notification,
    });
  };

export const clearNotifications =
  () => (dispatch: Dispatch<NotificationsActions>) => {
    dispatch({
      type: NotificationsActionType.CLEAR_NOTIFICATIONS,
    });
  };

export const initNotificationCollection =
  (notifications: Notification[]) =>
  (dispatch: Dispatch<NotificationsActions>) => {
    dispatch({
      type: NotificationsActionType.INIT_NOTIFICATION_COLLECTION,
      notifications,
    });
  };

export const saveShoppingList =
  (shoppingList: ShoppingList) =>
  (dispatch: Dispatch<ShoppingListsActions>) => {
    dispatch({
      type: ShoppingListsActionType.SAVE_SHOPPING_LIST,
      shoppingList,
    });
  };

export const deleteShoppingList =
  (shoppingList: ShoppingList) =>
  (dispatch: Dispatch<ShoppingListsActions>) => {
    dispatch({
      type: ShoppingListsActionType.DELETE_SHOPPING_LIST,
      shoppingList,
    });
  };

export const initShoppingListCollection =
  (shoppingLists: ShoppingList[]) =>
  (dispatch: Dispatch<ShoppingListsActions>) => {
    dispatch({
      type: ShoppingListsActionType.INIT_SHOPPING_LIST_COLLECTION,
      shoppingLists,
    });
  };

export const saveShoppingListItem =
  (shoppingListItem: ShoppingListItem) =>
  (dispatch: Dispatch<ShoppingListsActions>) => {
    dispatch({
      type: ShoppingListsActionType.SAVE_SHOPPING_LIST_ITEM,
      shoppingListItem,
    });
  };

export const deleteShoppingListItem =
  (shoppingListItem: ShoppingListItem) =>
  (dispatch: Dispatch<ShoppingListsActions>) => {
    dispatch({
      type: ShoppingListsActionType.DELETE_SHOPPING_LIST_ITEM,
      shoppingListItem,
    });
  };

export const initShoppingListItemCollection =
  (shoppingListItems: ShoppingListItem[]) =>
  (dispatch: Dispatch<ShoppingListsActions>) => {
    dispatch({
      type: ShoppingListsActionType.INIT_SHOPPING_LIST_ITEM_COLLECTION,
      shoppingListItems,
    });
  };

export const saveGroup =
  (group: Group) => (dispatch: Dispatch<GroupsActions>) => {
    dispatch({
      type: GroupsActionType.SAVE_GROUP,
      group,
    });
  };

export const deleteGroup =
  (group: Group) => (dispatch: Dispatch<GroupsActions>) => {
    dispatch({
      type: GroupsActionType.DELETE_GROUP,
      group,
    });
  };

export const initGroupsCollection =
  (groupCollection: Group[]) => (dispatch: Dispatch<GroupsActions>) => {
    dispatch({
      type: GroupsActionType.INIT_GROUP_COLLECTION,
      groupCollection,
    });
  };

export const initMemberInGroupCollection =
  (groupCollection: Group[]) => (dispatch: Dispatch<GroupsActions>) => {
    dispatch({
      type: GroupsActionType.INIT_MEMBER_IN_GROUP_COLLECTION,
      groupCollection,
    });
  };

export const showSnack =
  (infoMessage: string) => (dispatch: Dispatch<MessageSnackbarActions>) => {
    dispatch({
      type: MessageSnackbarActionType.SHOW_INFO,
      infoMessage,
    });
  };

export const showLoadingActivityIndicator =
  () => (dispatch: Dispatch<ApiActivityActions>) => {
    dispatch({
      type: ApiActivityActionType.DATA_FETCHING_STARTED,
    });
  };

export const hideLoadingActivityIndicator =
  () => (dispatch: Dispatch<ApiActivityActions>) => {
    dispatch({
      type: ApiActivityActionType.DATA_FETCHING_FINISHED,
    });
  };
