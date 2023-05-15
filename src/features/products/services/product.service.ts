import { v4 as uuidv4 } from "uuid";
import Product from "../classes/product.class";
import AuthGuardService from "../../../services/firebase/auth-guard.service";
import DbContext from "../../../services/applicationData/localDatabase/classes/db-context.class";

type StateActions = {
  saveProduct: (product: Product) => any;
};
export default class ProductService {
  private readonly products: Product[];

  private readonly authGuardService: AuthGuardService;

  private readonly stateActions: StateActions;

  constructor(
    products: Product[],
    authGuardService: AuthGuardService,
    stateActions: StateActions
  ) {
    this.products = products;
    this.authGuardService = authGuardService;
    this.stateActions = stateActions;
  }

  createNewProduct(data?: Partial<Product>): Product {
    const newProduct = new Product(
      uuidv4(),
      data?.barCode ?? "",
      data?.name ?? "",
      data?.measureUnit ?? "",
      data?.packageWeight ?? 1
    );

    newProduct.ownerUid = this.authGuardService.getAuthUserUid();

    // console.log("created", newProduct);

    return newProduct;
  }

  saveProduct(
    product: Product,
    successCallback?: () => any,
    errorCallback?: () => any
  ): void {
    const db = DbContext.getInstance().database;
    db.save(product as Product)
      .then(() => {
        // save on firebase;
        this.stateActions.saveProduct(product);
        // console.log("saved", product);
        if (successCallback) {
          return successCallback();
        }
      })
      .catch((e) => {
        console.log(`Failed to save product ${product.uuid}`, e);
        if (errorCallback) {
          return errorCallback();
        }
      });
  }

  deleteProduct(
    product: Product,
    successCallback?: () => any,
    errorCallback?: () => any
  ): void {}

  getProducts(): Product[] {
    return this.products;
  }
}
