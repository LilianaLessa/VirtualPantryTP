export enum LocalTable {
  PRODUCT = "product",
  PANTRY = "pantry",
  STORED_PRODUCT = "stored_product",
}

export type TableNames =
  | LocalTable.PRODUCT
  | LocalTable.PANTRY
  | LocalTable.STORED_PRODUCT;
