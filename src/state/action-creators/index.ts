import { Dispatch } from "redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "firebase/auth";
import { IProduct } from "../../features/products/interfaces/product.interface";
import {
  MessageSnackbarActionType,
  NotificationsActionType,
  PantriesActionType,
  SavedProductsActionType,
  ShoppingListsActionType,
  StoredProductActionType,
} from "../action-types";
import {
  MessageSnackbarActions,
  NotificationsActions,
  PantriesActions,
  SavedProductsActions,
  ShoppingListsActions,
  StoredProductActions,
} from "../actions";
import { IPantry } from "../../features/pantries/interfaces/pantry.interface";
import { IStoredProduct } from "../../features/products/interfaces/stored-product.interface";
import { INotification } from "../../features/notification/interfaces/notification.interface";
import IShoppingList from "../../features/shoppingList/interfaces/shopping-list.interface";

/**
 * todo maybe these actions shouldn't be interfaces, but classes?
 *     this way, the client wouldn't need to take care of setting the correct action.
 */

export const saveProduct =
  (product: IProduct) =>
  (dispatch: Dispatch<SavedProductsActions | MessageSnackbarActions>) => {
    AsyncStorage.getItem("@loggedUser").then((result) => {
      const storedUser = result ? JSON.parse(result) : null;
      console.log(storedUser?.uid, product.ownerUid);
      if (storedUser !== null && product.ownerUid === "undefined") {
        product.ownerUid = storedUser.uid;
      }
      dispatch({
        type: MessageSnackbarActionType.SHOW_INFO,
        infoMessage: `Product '${product.name}' saved.`,
      });
      dispatch({
        type: SavedProductsActionType.SAVE_PRODUCT,
        newProduct: product,
      });
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
  (pantry: IPantry) =>
  (dispatch: Dispatch<PantriesActions | MessageSnackbarActions>) => {
    dispatch({
      type: MessageSnackbarActionType.SHOW_INFO,
      infoMessage: `Pantry '${pantry.name}' saved.`,
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
  (productToStore: IStoredProduct) =>
  (dispatch: Dispatch<StoredProductActions | MessageSnackbarActions>) => {
    dispatch({
      type: MessageSnackbarActionType.SHOW_INFO,
      infoMessage: `Product '${productToStore.product.name}' was stored on '${productToStore.pantry.name}.'`,
    });
    dispatch({
      type: StoredProductActionType.STORE_PRODUCT,
      productToStore,
    });
  };

export const deleteStoredProduct =
  (storedProductToDelete: IStoredProduct) =>
  (dispatch: Dispatch<StoredProductActions | MessageSnackbarActions>) => {
    dispatch({
      type: MessageSnackbarActionType.SHOW_INFO,
      infoMessage: `Product '${storedProductToDelete.product.name}' was removed from '${storedProductToDelete.pantry.name}.'`,
    });
    dispatch({
      type: StoredProductActionType.DELETE_STORED_PRODUCT,
      storedProductToDelete,
    });
  };

export const initStoredProductCollection =
  (storedProductCollection: IStoredProduct[]) =>
  (dispatch: Dispatch<StoredProductActions>) => {
    dispatch({
      type: StoredProductActionType.INIT_STORED_PRODUCT_COLLECTION,
      storedProductCollection,
    });
  };

export const deleteNotification =
  (notificationToRemove: INotification) =>
  (dispatch: Dispatch<NotificationsActions>) => {
    dispatch({
      type: NotificationsActionType.REMOVE_NOTIFICATION,
      notificationToRemove,
    });
  };

export const clearNotifications =
  () => (dispatch: Dispatch<NotificationsActions>) => {
    dispatch({
      type: NotificationsActionType.CLEAR_NOTIFICATIONS,
    });
  };

export const saveShoppingList =
  (newShoppingList: IShoppingList) =>
  (dispatch: Dispatch<ShoppingListsActions>) => {
    dispatch({
      type: ShoppingListsActionType.SAVE_SHOPPING_LIST,
      newShoppingList,
    });
  };

export const deleteShoppingList =
  (shoppingListToDelete: IShoppingList) =>
  (dispatch: Dispatch<ShoppingListsActions>) => {
    dispatch({
      type: ShoppingListsActionType.DELETE_SHOPPING_LIST,
      shoppingListToDelete,
    });
  };
