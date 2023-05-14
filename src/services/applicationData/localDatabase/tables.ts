export enum LocalTable {
  PRODUCT = "product",
  PANTRY = "pantry",
  STORED_PRODUCT = "stored_product",
  GROUP = "group_table", // as group is a reserved word in sql, the suffix _table was needed.
  USER_IN_GROUP = "user_in_group",
}

export type TableNames =
  | LocalTable.PRODUCT
  | LocalTable.PANTRY
  | LocalTable.STORED_PRODUCT
  | LocalTable.GROUP
  | LocalTable.USER_IN_GROUP;
