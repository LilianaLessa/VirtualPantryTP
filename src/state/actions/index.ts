import { SavedProductsActionType } from "../action-types";
import { IProduct } from "../../features/products/interfaces/product.interface";

interface SaveProductAction {
  type: SavedProductsActionType.SAVE_PRODUCT;
  newProduct: IProduct;
}

interface DeleteProductAction {
  type: SavedProductsActionType.DELETE_PRODUCT;
  productToDelete: IProduct;
}

export type SavedProductsActions = SaveProductAction | DeleteProductAction;
