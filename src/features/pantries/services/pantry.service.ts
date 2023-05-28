import { v4 as uuidv4 } from "uuid";
import Pantry from "../classes/pantry.class";
import AuthGuardService from "../../../services/firebase/auth-guard.service";
import DbContext from "../../../services/applicationData/localDatabase/classes/db-context.class";
import IFirestoreObject from "../../../services/firebase/interfaces/firestore-object.interface";
import StoredProduct from "../../products/classes/stored.product";
import { getStackTraceAsString } from "../../../dev-utils";
import Product from "../../products/classes/product.class";
import NotificationService from "../../notification/services/notification.service";
import ConfigurationService from "../../configuration/services/configuration.service";

type StateActions = {
  savePantry: (pantry: Pantry) => any;
  deletePantry: (pantry: Pantry) => any;
  storeProduct: (storedProduct: StoredProduct) => any;
  deleteStoredProduct: (storedProduct: StoredProduct) => any;
  showLoadingActivityIndicator: () => any;
  hideLoadingActivityIndicator: () => any;
};

type FirestoreActions = {
  saveObject: (firestoreObject: IFirestoreObject) => Promise<any>;
  deleteObject: (firestoreObject: IFirestoreObject) => Promise<any>;
};

export default class PantryService {
  private readonly pantries: Pantry[];

  private readonly storedProducts: StoredProduct[];

  private readonly authGuardService: AuthGuardService;

  private readonly notificationService: NotificationService;

  private readonly configurationService: ConfigurationService;

  private readonly stateActions: StateActions;

  private readonly firestoreActions: FirestoreActions;

  private static foregroundExpirationNotificationCheckTimerId: // todo this should be info from async storage, as it shouldn't depend on class or instance.
  number | undefined;

  constructor(
    pantries: Pantry[],
    storedProducts: StoredProduct[],
    authGuardService: AuthGuardService,
    notificationService: NotificationService,
    configurationService: ConfigurationService,
    stateActions: StateActions,
    firestoreActions: FirestoreActions
  ) {
    this.pantries = pantries;
    this.storedProducts = storedProducts;
    this.authGuardService = authGuardService;
    this.notificationService = notificationService;
    this.configurationService = configurationService;
    this.stateActions = stateActions;
    this.firestoreActions = firestoreActions;

    this.initForegroundExpirationNotificationCheck();
  }

  destructor() {
    this.stopForegroundExpirationTimeNotificationCheck();
  }

  createNewPantry(data?: Partial<Pantry>): Pantry {
    const newPantry = new Pantry(uuidv4(), data?.name);
    newPantry.ownerUid = this.authGuardService.getAuthUserUid(true);

    return newPantry;
  }

  savePantry(
    pantry: Pantry,
    successCallback?: () => any,
    errorCallback?: () => any
  ): void {
    this.stateActions.showLoadingActivityIndicator();
    const db = DbContext.getInstance().database;
    const updatedPantry = pantry.clone({
      updatedAt: new Date().toString(),
    });
    // save on local;
    db.save(updatedPantry as Pantry)
      .then(() => {
        this.authGuardService
          .guard(
            () =>
              this.firestoreActions
                .saveObject(updatedPantry)
                .then((savedPantry: Pantry) =>
                  // update local copy with firebase id
                  db.save(savedPantry as Pantry).then(() => savedPantry)
                ),
            () => Promise.resolve(updatedPantry)
          )
          .then((savedPantry) => {
            // save on state
            this.stateActions.savePantry(savedPantry);
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
        console.log(`Error on saving pantry '${pantry.uuid}'`, e);
        if (errorCallback) {
          errorCallback();
        }
      });
  }

  deletePantry(
    pantry: Pantry,
    successCallback?: () => any,
    errorCallback?: () => any
  ): void {
    this.stateActions.showLoadingActivityIndicator();
    const db = DbContext.getInstance().database;
    // delete on local;
    db.delete(pantry as Pantry)
      .then(() => {
        // delete from firestore
        this.authGuardService
          .guard(
            () => this.firestoreActions.deleteObject(pantry),
            () => Promise.resolve(null)
          )
          .then(() => {
            // delete on state
            this.stateActions.deletePantry(pantry);
          });
      })
      .then(() => {
        this.stateActions.hideLoadingActivityIndicator();
        if (successCallback) {
          successCallback();
        }
      })
      .catch((e) => {
        this.stateActions.hideLoadingActivityIndicator();
        console.log(`Error on deleting pantry '${pantry.uuid}'`, e);
        if (errorCallback) {
          errorCallback();
        }
      });
  }

  storeProduct(
    storedProduct: StoredProduct,
    successCallback?: () => any,
    errorCallback?: () => any
  ): void {
    this.stateActions.showLoadingActivityIndicator();
    const db = DbContext.getInstance().database;
    const updatedStoredProduct = storedProduct.clone({
      updatedAt: new Date().toString(),
    });
    // save on local;
    db.save(updatedStoredProduct as StoredProduct)
      .then(() => {
        this.authGuardService
          .guard(
            () =>
              this.firestoreActions
                .saveObject(updatedStoredProduct)
                .then((savedStoredProduct: StoredProduct) =>
                  // update local copy with firebase id
                  db
                    .save(savedStoredProduct as StoredProduct)
                    .then(() => savedStoredProduct)
                ),
            () => Promise.resolve(updatedStoredProduct)
          )
          .then((savedStoredProduct: StoredProduct) => {
            // save on state
            this.stateActions.storeProduct(savedStoredProduct);
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
          `Error on saving stored product '${storedProduct.uuid}'`,
          e,
          getStackTraceAsString(e)
        );
        if (errorCallback) {
          errorCallback();
        }
      });
  }

  deleteStoredProduct(
    storedProduct: StoredProduct,
    successCallback?: () => any,
    errorCallback?: () => any
  ): void {
    this.stateActions.showLoadingActivityIndicator();
    const db = DbContext.getInstance().database;
    // delete on local;
    db.delete(storedProduct as StoredProduct)
      .then(() => {
        // delete from firestore
        this.authGuardService
          .guard(
            () => this.firestoreActions.deleteObject(storedProduct),
            () => Promise.resolve(null)
          )
          .then(() => {
            // delete on state
            this.stateActions.deleteStoredProduct(storedProduct);
          });
      })
      .then(() => {
        this.stateActions.hideLoadingActivityIndicator();
        if (successCallback) {
          successCallback();
        }
      })
      .catch((e) => {
        this.stateActions.hideLoadingActivityIndicator();
        console.log(
          `Error on deleting stored product '${storedProduct.uuid}'`,
          e
        );
        if (errorCallback) {
          errorCallback();
        }
      });
  }

  createStoredProduct(override?: Partial<StoredProduct>): StoredProduct {
    return new StoredProduct(uuidv4(), new Date().toString()).clone({
      ...override,
      ownerUid: this.authGuardService.getAuthUserUid(true),
    });
  }

  getPantryContent(pantry: Pantry): StoredProduct[] {
    return this.storedProducts.filter((p) => p.pantryUuid === pantry.uuid);
  }

  getPantryByUuid(uuid?: string): Pantry | undefined {
    return typeof uuid === "undefined"
      ? undefined
      : this.pantries.find((p) => p.uuid === uuid);
  }

  getStoredProductByUuid(uuid?: string): StoredProduct | undefined {
    return typeof uuid === "undefined"
      ? undefined
      : this.storedProducts.find((p) => p.uuid === uuid);
  }

  getPantries() {
    return this.pantries;
  }

  isOwnedByTheCurrentUser(pantry: Pantry): boolean {
    return this.authGuardService.getAuthUserUid(true) === pantry.ownerUid;
  }

  getStoredProductDisplayName(
    storedProduct?: StoredProduct,
    product?: Product
  ): string {
    const name =
      (storedProduct && storedProduct.name?.length > 0
        ? storedProduct?.name
        : product?.name) ?? "(stored product not found)";
    const productName =
      product?.name && name !== product?.name ? ` (${product?.name})` : "";

    console.log(name, productName);
    return `${name}${productName}`;
  }

  expirationNotificationCheck() {
    const currentTime = new Date();
    console.log("expiration notification check", currentTime);
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;

    const {
      productExpiringNotification: { hours, minutes, daysBefore },
    } = this.getConfiguration();

    const hourToTrigger = hours;
    const minuteToTrigger = minutes;
    const msBeforeExpiration = daysBefore * _MS_PER_DAY;

    if (
      currentTime.getHours() == hourToTrigger &&
      currentTime.getMinutes() == minuteToTrigger
    ) {
      this.storedProducts.forEach((storedProduct: StoredProduct) => {
        if (typeof storedProduct.bestBefore !== "undefined") {
          const expirationDate = new Date(storedProduct.bestBefore);
          const diffInMilliseconds = expirationDate - currentTime;
          console.log(
            storedProduct.name,
            storedProduct.uuid,
            diffInMilliseconds,
            msBeforeExpiration
          );
          if (diffInMilliseconds <= msBeforeExpiration) {
            this.notificationService.saveNotification(
              this.notificationService.createExpirationNoticeNotification(
                storedProduct
              )
            );
          }
        }
      });
    }
  }

  private initForegroundExpirationNotificationCheck() {
    const {
      productExpiringNotification: { enabled },
    } = this.getConfiguration();
    if (enabled) {
      if (
        typeof PantryService.foregroundExpirationNotificationCheckTimerId ===
        "undefined"
      ) {
        console.log("starting foreground expiration notification check");
        // this.foregroundExpirationNotificationCheck();
        PantryService.foregroundExpirationNotificationCheckTimerId =
          setInterval(() => {
            this.expirationNotificationCheck();
          }, 60000);
      }
    }
  }

  private stopForegroundExpirationTimeNotificationCheck(): void {
    console.log("stopping foreground expiration notification check");
    if (
      typeof PantryService.foregroundExpirationNotificationCheckTimerId !==
      "undefined"
    ) {
      clearInterval(PantryService.foregroundExpirationNotificationCheckTimerId);
      PantryService.foregroundExpirationNotificationCheckTimerId = undefined;
    }
  }

  private getConfiguration() {
    return (
      this.configurationService.getConfiguration()?.data ?? {
        productExpiringNotification: {
          hours: 0,
          minutes: 0,
          daysBefore: 1,
          enabled: false,
        },
      }
    );
  }
}
