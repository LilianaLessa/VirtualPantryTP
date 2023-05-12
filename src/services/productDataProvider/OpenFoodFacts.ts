// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 as uuidv4 } from "uuid";

import { ApiTypes, OpenFoodFactsApi } from "openfoodfac-ts";
import IProductDataProvider from "./IProductDataProvider";
import { IProduct } from "../../features/products/interfaces/product.interface";
import { store } from "../../state";
import { ApiActivityActionType } from "../../state/action-types";
import Product from "../../features/products/classes/product.class";

export default class OpenFoodFacts implements IProductDataProvider {
  // eslint-disable-next-line class-methods-use-this
  getProductByBarCode(
    barcode: string,
    successCallback: (product: IProduct) => void,
    // eslint-disable-next-line comma-dangle
    errorCallback: (error?: any) => void
  ): void {
    store.dispatch({ type: ApiActivityActionType.DATA_FETCHING_STARTED });
    const openFoodFactsApi = new OpenFoodFactsApi();

    openFoodFactsApi
      .findProductByBarcode(barcode)
      .then((apiResponse: ApiTypes.Product | null) => {
        store.dispatch({ type: ApiActivityActionType.DATA_FETCHING_FINISHED });
        if (apiResponse !== null) {
          successCallback(
            new Product(uuidv4(), apiResponse.code, apiResponse.product_name)
          );
        } else {
          // console.log("Error from openFoodFactsApi:", apiResponse);
          errorCallback(apiResponse);
        }
      })
      .catch((error) => {
        store.dispatch({ type: ApiActivityActionType.DATA_FETCHING_FINISHED });
        errorCallback(error);
      });
  }
}
