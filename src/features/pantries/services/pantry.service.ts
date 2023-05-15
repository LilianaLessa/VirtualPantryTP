import { v4 as uuidv4 } from "uuid";
import Pantry from "../classes/pantry.class";
import AuthGuardService from "../../../services/firebase/auth-guard.service";
import DbContext from "../../../services/applicationData/localDatabase/classes/db-context.class";
import IFirestoreObject from "../../../services/firebase/interfaces/firestore-object.interface";

type StateActions = {
  savePantry: (pantry: Pantry) => any;
  deletePantry: (pantry: Pantry) => any;
  showLoadingActivityIndicator: () => any;
  hideLoadingActivityIndicator: () => any;
};

type FirestoreActions = {
  saveObject: (firestoreObject: IFirestoreObject) => Promise<any>;
  deleteObject: (firestoreObject: IFirestoreObject) => Promise<any>;
};

export default class PantryService {
  private readonly pantries: Pantry[];

  private readonly authGuardService: AuthGuardService;

  private readonly stateActions: StateActions;

  private readonly firestoreActions: FirestoreActions;

  constructor(
    pantries: Pantry[],
    authGuardService: AuthGuardService,
    stateActions: StateActions,
    firestoreActions: FirestoreActions
  ) {
    this.pantries = pantries;
    this.authGuardService = authGuardService;
    this.stateActions = stateActions;
    this.firestoreActions = firestoreActions;
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

  getPantries() {
    return this.pantries;
  }
}
