// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 as uuidv4 } from "uuid";
// eslint-disable-next-line import/no-extraneous-dependencies
import { ApiTypes, OpenFoodFactsApi } from "openfoodfac-ts";
import IProductDataProvider from "./IProductDataProvider";
import { IProduct } from "../../features/products/interfaces/product.interface";
import Product from "../../features/products/classes/product.class";

export default class OpenFoodFacts implements IProductDataProvider {
  // eslint-disable-next-line class-methods-use-this
  getProductByBarCode(
    barcode: string,
    successCallback: (product: IProduct) => void,
    // eslint-disable-next-line comma-dangle
    errorCallback: (error: any) => void
  ): void {
    const openFoodFactsApi = new OpenFoodFactsApi();

    openFoodFactsApi
      .findProductByBarcode(barcode)
      .then((apiResponse: ApiTypes.Product | null) => {
        if (apiResponse !== null) {
          successCallback(new Product(uuidv4(), apiResponse.product_name));
        } else {
          errorCallback(apiResponse);
        }
      })
      .catch((error) => {
        errorCallback(error);
      });
  }
}
