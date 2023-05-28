import { v4 as uuidv4 } from "uuid";
import IFirestoreObject from "../../../services/firebase/interfaces/firestore-object.interface";
import ShoppingList from "../classes/shopping-list.class";
import ShoppingListItem from "../classes/shopping-list-item.class";
import AuthGuardService from "../../../services/firebase/auth-guard.service";
import DbContext from "../../../services/applicationData/localDatabase/classes/db-context.class";
import ProductService from "../../products/services/product.service";

type StateActions = {
  saveShoppingList: (shoppingList: ShoppingList) => any;
  deleteShoppingList: (shoppingList: ShoppingList) => any;
  saveShoppingListItem: (shoppingListItem: ShoppingListItem) => any;
  deleteShoppingListItem: (shoppingListItem: ShoppingListItem) => any;
  showLoadingActivityIndicator: () => any;
  hideLoadingActivityIndicator: () => any;
};

type FirestoreActions = {
  saveObject: (firestoreObject: IFirestoreObject) => Promise<any>;
  deleteObject: (firestoreObject: IFirestoreObject) => Promise<any>;
};

export default class ShoppingListService {
  private readonly shoppingLists: ShoppingList[];

  private readonly shoppingListItems: ShoppingListItem[];

  private readonly authGuardService: AuthGuardService;

  private readonly productService: ProductService;

  private readonly stateActions: StateActions;

  private readonly firestoreActions: FirestoreActions;

  addItemToShoppingListCallback?: any;

  constructor(
    shoppingLists: ShoppingList[],
    shoppingListItems: ShoppingListItem[],
    authGuardService: AuthGuardService,
    productService: ProductService,
    stateActions: StateActions,
    firestoreActions: FirestoreActions
  ) {
    this.shoppingLists = shoppingLists;
    this.shoppingListItems = shoppingListItems;
    this.authGuardService = authGuardService;
    this.productService = productService;
    this.stateActions = stateActions;
    this.firestoreActions = firestoreActions;

    this.addItemToShoppingListCallback = undefined;
  }

  getShoppingLists(): ShoppingList[] {
    return this.shoppingLists;
  }

  getItemsOnShoppingList(shoppingList: ShoppingList): ShoppingListItem[] {
    return this.shoppingListItems.filter(
      (i) => i.shoppingListUuid === shoppingList.uuid
    );
  }

  generateSuggestedItems(shoppingList: ShoppingList): ShoppingListItem[] {
    const products = this.productService.getProducts().slice(0, 5);

    return products.map((p) =>
      this.createNewShoppingListItem(shoppingList, { name: p.name })
    );
  }

  getProgressInfo(shoppingList: ShoppingList): {
    boughtItemsAmount: number;
    totalItemsAmount: number;
    progress: number;
  } {
    const items = this.getItemsOnShoppingList(shoppingList);

    const boughtItemsAmount = items.filter((i) => i.bought).length;
    const totalItemsAmount = items.length;
    const progress =
      totalItemsAmount === 0 ? 0 : boughtItemsAmount / totalItemsAmount;
    return { boughtItemsAmount, totalItemsAmount, progress };
  }

  createNewShoppingList(data?: Partial<ShoppingList>): ShoppingList {
    return new ShoppingList(uuidv4()).clone({
      ...data,
      ownerUid: this.authGuardService.getAuthUserUid(true),
    });
  }

  createNewShoppingListItem(
    parentShoppingList: ShoppingList,
    data?: Partial<ShoppingListItem>
  ): ShoppingListItem {
    return new ShoppingListItem(uuidv4(), parentShoppingList.uuid).clone({
      ...data,
      ownerUid: this.authGuardService.getAuthUserUid(true),
    });
  }

  saveShoppingList(shoppingList: ShoppingList) {
    return this.saveEntity(shoppingList, this.stateActions.saveShoppingList);
  }

  saveShoppingListItem(shoppingListItem: ShoppingListItem) {
    return this.saveEntity(
      shoppingListItem,
      this.stateActions.saveShoppingListItem
    );
  }

  deleteShoppingList(shoppingList: ShoppingList) {
    return Promise.all([
      this.getItemsOnShoppingList(shoppingList).map((i) =>
        this.deleteShoppingListItem(i)
      ),
    ]).then(() =>
      this.deleteEntity(shoppingList, this.stateActions.deleteShoppingList)
    );
  }

  deleteShoppingListItem(shoppingListItem: ShoppingListItem) {
    return this.deleteEntity(
      shoppingListItem,
      this.stateActions.deleteShoppingListItem
    );
  }

  // todo move it to generic class
  private deleteEntity<T>(
    entity: T,
    stateUpdater: (s: T) => void
  ): Promise<void> {
    this.stateActions.showLoadingActivityIndicator();
    const db = DbContext.getInstance().database;
    // delete on local;
    return db
      .delete(entity)
      .then(() => {
        // delete from firestore
        this.authGuardService
          .guard(
            () => this.firestoreActions.deleteObject(entity),
            () => Promise.resolve(null)
          )
          .then(() => {
            // delete on state
            stateUpdater(entity);
          });
      })
      .then(() => {
        this.stateActions.hideLoadingActivityIndicator();
      })
      .catch((e) => {
        this.stateActions.hideLoadingActivityIndicator();
        console.log(
          `Error on saving entity<${entity.constructor.name}>'${entity.uuid}'`,
          e
        );
        throw e;
      });
  }

  // todo move it to generic class
  private saveEntity<T>(
    entity: T,
    stateUpdater: (sEntity: T) => void
  ): Promise<void> {
    this.stateActions.showLoadingActivityIndicator();
    const db = DbContext.getInstance().database;
    const updatedEntity = entity.clone({
      updatedAt: new Date().toString(),
    });
    // save on local;
    return db
      .save(updatedEntity as T)
      .then(() => {
        this.authGuardService
          .guard(
            () =>
              this.firestoreActions
                .saveObject(updatedEntity)
                .then((savedEntity: T) =>
                  // update local copy with firebase id
                  db.save(savedEntity as T).then(() => savedEntity)
                ),
            () => Promise.resolve(updatedEntity)
          )
          .then((savedEntity: T) => {
            // save on state
            stateUpdater(savedEntity);
          });
      })
      .then(() => {
        this.stateActions.hideLoadingActivityIndicator();
      })
      .catch((e) => {
        this.stateActions.hideLoadingActivityIndicator();
        console.log(
          `Error on saving entity<${entity.constructor.name}>'${entity.uuid}'`,
          e
        );
        throw e;
      });
  }

  isOwnedByTheCurrentUser(shoppingList: ShoppingList): boolean {
    return (
      this.authGuardService.getAuthUserUid(true) ===
      (shoppingList.ownerUid ? shoppingList.ownerUid : undefined)
    );
  }
}
