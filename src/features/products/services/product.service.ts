import { v4 as uuidv4 } from "uuid";
import Product from "../classes/product.class";
import AuthGuardService from "../../../services/firebase/auth-guard.service";
import DbContext from "../../../services/applicationData/localDatabase/classes/db-context.class";

export type ProductSearchQuery = {
  term: string;
  barCode: string;
};

type StateActions = {
  saveProduct: (product: Product) => any;
  deleteProduct: (product: Product) => any;
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
        // save on state
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
  ): void {
    const db = DbContext.getInstance().database;
    db.delete(product as Product)
      .then(() => {
        // delete from firebase;
        // delete from state
        this.stateActions.deleteProduct(product);
        if (successCallback) {
          return successCallback();
        }
      })
      .catch((e) => {
        console.log(
          `Failed to delete product ${product.uuid}`,
          e,
          e.stack
            .split("\n")
            .slice(2)
            .map((line) => line.replace(/\s+at\s+/, ""))
            .join("\n")
        );
        if (errorCallback) {
          return errorCallback();
        }
      });
  }

  getProducts(): Product[] {
    return this.products;
  }

  searchProducts(query?: Partial<ProductSearchQuery>): Product[] {
    if (typeof query === "undefined") {
      return this.getProducts();
    }

    if (typeof query.term !== "undefined") {
      return this.products.filter((product: Product) =>
        product.name.toLowerCase().includes(query.term.toLowerCase())
      );
    }

    if (typeof query.barCode !== "undefined") {
      return this.products.filter(
        (product: Product) => product.barCode === query.barCode
      );
    }

    return [];
  }
}
