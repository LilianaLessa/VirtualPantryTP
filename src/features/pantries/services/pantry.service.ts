import { v4 as uuidv4 } from "uuid";
import Pantry from "../classes/pantry.class";
import AuthGuardService from "../../../services/firebase/auth-guard.service";
import DbContext from "../../../services/applicationData/localDatabase/classes/db-context.class";

type StateActions = {
  savePantry: (pantry: Pantry) => any;
  deletePantry: (pantry: Pantry) => any;
};

export default class PantryService {
  private readonly pantries: Pantry[];

  private readonly authGuardService: AuthGuardService;

  private readonly stateActions: StateActions;

  constructor(
    pantries: Pantry[],
    authGuardService: AuthGuardService,
    stateActions: StateActions
  ) {
    this.pantries = pantries;
    this.authGuardService = authGuardService;
    this.stateActions = stateActions;
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
    const db = DbContext.getInstance().database;
    const updatedPantry = pantry.clone({
      updatedAt: new Date().toString(),
    });

    // save on local;
    db.save(updatedPantry as Pantry)
      .then(() => {
        const savedPantry = updatedPantry;
        // save on firebase;
        // update local copy;
        // save on state
        this.stateActions.savePantry(savedPantry);
        if (successCallback) {
          successCallback();
        }
      })
      .catch((e) => {
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
    const db = DbContext.getInstance().database;
    // delete on local;
    db.delete(pantry as Pantry)
      .then(() => {
        // delete on firebase;
        // delete on state
        this.stateActions.deletePantry(pantry);
        if (successCallback) {
          successCallback();
        }
      })
      .catch((e) => {
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
