export enum LocalTable {
  PRODUCT = "product",
  PANTRY = "pantry",
  STORED_PRODUCT = "stored_product",
  GROUP = "group_table", // as group is a reserved word in sql, the suffix _table was needed.
  USER_IN_GROUP = "user_in_group",
  SHOPPING_LIST = "shopping_list",
  SHOPPING_LIST_ITEM = "shopping_list_item",
  NOTIFICATION = "notification",
  CONFIGURATION = "configuration",
}

export type TableNames =
  | LocalTable.PRODUCT
  | LocalTable.PANTRY
  | LocalTable.STORED_PRODUCT
  | LocalTable.GROUP
  | LocalTable.SHOPPING_LIST
  | LocalTable.SHOPPING_LIST_ITEM
  | LocalTable.USER_IN_GROUP
  | LocalTable.NOTIFICATION
  | LocalTable.CONFIGURATION;
