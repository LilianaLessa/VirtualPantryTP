export enum LocalTable {
  PRODUCT = "product",
  PANTRY = "pantry",
  STORED_PRODUCT = "stored_product",
  GROUP = "group",
  USER_IN_GROUP = "user_in_group",
}

export type TableNames =
  | LocalTable.PRODUCT
  | LocalTable.PANTRY
  | LocalTable.STORED_PRODUCT
  | LocalTable.GROUP
  | LocalTable.USER_IN_GROUP;
