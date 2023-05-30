// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { v4 as uuidv4 } from "uuid";
import Product from "../classes/product.class";
import AuthGuardService from "../../../services/firebase/auth-guard.service";
import DbContext from "../../../services/applicationData/localDatabase/classes/db-context.class";
import IFirestoreObject from "../../../services/firebase/interfaces/firestore-object.interface";

type StateActions = {
  saveProduct: (product: Product) => any;
  deleteProduct: (product: Product) => any;
  showLoadingActivityIndicator: () => any;
  hideLoadingActivityIndicator: () => any;
};

type FirestoreActions = {
  saveObject: (firestoreObject: IFirestoreObject) => Promise<any>;
  deleteObject: (firestoreObject: IFirestoreObject) => Promise<any>;
};

export type ProductSearchQuery = {
  term: string;
  barCode: string;
};

export default class ProductService {
  private readonly products: Product[];

  private readonly authGuardService: AuthGuardService;

  private readonly stateActions: StateActions;

  private readonly firestoreActions: FirestoreActions;

  constructor(
    products: Product[],
    authGuardService: AuthGuardService,
    stateActions: StateActions,
    firestoreActions: FirestoreActions
  ) {
    this.products = products;
    this.authGuardService = authGuardService;
    this.stateActions = stateActions;
    this.firestoreActions = firestoreActions;
  }

  isOwnedByTheCurrentUser(product: Product): boolean {
    return (
      this.authGuardService.getAuthUserUid(true) ===
      (product.ownerUid ? product.ownerUid : undefined)
    );
  }

  createNewProduct(data?: Partial<Product>): Product {
    const newProduct = new Product(
      uuidv4(),
      data?.barCode ?? "",
      data?.name ?? "",
      data?.measureUnit ?? "",
      data?.packageWeight ?? 1
    );

    newProduct.ownerUid = this.authGuardService.getAuthUserUid(true);
    return newProduct;
  }

  saveProduct(
    product: Product,
    successCallback?: () => any,
    errorCallback?: () => any
  ): void {
    this.stateActions.showLoadingActivityIndicator();
    const updatedProduct = product.clone({
      updatedAt: new Date().toString(),
    });
    const db = DbContext.getInstance().database;
    db.save(updatedProduct as Product)
      .then(() => {
        this.authGuardService
          .guard(
            () =>
              this.firestoreActions
                .saveObject(updatedProduct)
                .then((savedProduct: Product) =>
                  // update local copy with firebase id
                  db.save(savedProduct as Product).then(() => savedProduct)
                ),
            () => Promise.resolve(updatedProduct)
          )
          .then((savedProduct) => {
            // save on state
            this.stateActions.saveProduct(savedProduct);
          });
      })
      .then(() => {
        this.stateActions.hideLoadingActivityIndicator();
        if (successCallback) {
          return successCallback();
        }
      })
      .catch((e) => {
        this.stateActions.hideLoadingActivityIndicator();
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
    this.stateActions.showLoadingActivityIndicator();
    const db = DbContext.getInstance().database;
    db.delete(product as Product)
      .then(() => {
        // delete from firestore
        this.authGuardService
          .guard(
            () => this.firestoreActions.deleteObject(product),
            () => Promise.resolve(null)
          )
          .then(() => {
            // delete on state
            this.stateActions.deleteProduct(product);
          });
      })
      .then(() => {
        this.stateActions.hideLoadingActivityIndicator();
        if (successCallback) {
          return successCallback();
        }
      })
      .catch((e) => {
        this.stateActions.hideLoadingActivityIndicator();
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

  getProductByUuid(uuid?: string): Product | undefined {
    return typeof uuid === "undefined"
      ? undefined
      : this.products.find((p) => p.uuid === uuid);
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
