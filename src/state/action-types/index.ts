// eslint-disable-next-line no-shadow
export enum SavedProductsActionType {
  SAVE_PRODUCT = "save_product",
  DELETE_PRODUCT = "delete_product",
  INIT_COLLECTION = "init_collection",
}

// eslint-disable-next-line no-shadow
export enum StoredProductActionType {
  STORE_PRODUCT = "store_product",
  DELETE_STORED_PRODUCT = "delete_stored_product",
  INIT_STORED_PRODUCT_COLLECTION = "init_stored_product_collection",
}

// eslint-disable-next-line no-shadow
export enum PantriesActionType {
  SAVE_PANTRY = "save_pantry",
  DELETE_PANTRY = "delete_pantry",
  INIT_PANTRY_COLLECTION = "init_pantry_collection",
}

// eslint-disable-next-line no-shadow
export enum ApiActivityActionType {
  DATA_FETCHING_STARTED = "data_fetching_started",
  DATA_FETCHING_FINISHED = "data_fetching_finished",
}

// eslint-disable-next-line no-shadow
export enum MessageSnackbarActionType {
  SHOW_ERROR = "show_error",
  HIDE_ERROR = "hide_error",
  SHOW_INFO = "show_info",
  HIDE_INFO = "hide_info",
}

export enum NotificationsActionType {
  ADD_NOTIFICATION = "add_notification",
  REMOVE_NOTIFICATION = "remove_notification",
  READ_NOTIFICATION = "read_notification",
  CLEAR_NOTIFICATIONS = "clear_notifications",
}

export enum ShoppingListsActionType {
  SAVE_SHOPPING_LIST = "save_shopping_list",
  DELETE_SHOPPING_LIST = "delete_shopping_list",
  INIT_SHOPPING_LIST_COLLECTION = "init_shopping_list_collection",
  SAVE_SHOPPING_LIST_ITEM = "save_shopping_list_item",
  DELETE_SHOPPING_LIST_ITEM = "delete_shopping_list_item",
  INIT_SHOPPING_LIST_ITEM_COLLECTION = "init_shopping_list_item_collection",
}

export enum GroupsActionType {
  SAVE_GROUP = "save_group",
  DELETE_GROUP = "delete_group",
  INIT_GROUP_COLLECTION = "init_group_collection",
}
