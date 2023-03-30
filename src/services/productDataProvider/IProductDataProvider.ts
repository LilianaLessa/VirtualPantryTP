import { IProduct } from "../../features/products/interfaces/product.interface";

export default interface IProductDataProvider {
  // todo define error interface.
  getProductByBarCode: (
    barcode: string,
    successCallback: (product: IProduct) => void,
    errorCallback: (error: any) => void
  ) => void;
}
