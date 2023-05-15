import { ApiTypes, OpenFoodFactsApi } from "openfoodfac-ts";
import IProductDataProvider from "./IProductDataProvider";
import { store } from "../../state";
import { ApiActivityActionType } from "../../state/action-types";
import ProductService from "../../features/products/services/product.service";
import { IProduct } from "../../features/products/interfaces/product.interface";

export default class OpenFoodFacts implements IProductDataProvider {
  private readonly productService: ProductService;

  constructor(productService: ProductService) {
    this.productService = productService;
  }

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
            this.productService.createNewProduct({
              name: apiResponse.product_name,
            })
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
