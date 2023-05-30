// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import DbContext from "./localDatabase/classes/db-context.class";
import IFirestoreObject from "../firebase/interfaces/firestore-object.interface";
import AuthGuardService from "../firebase/auth-guard.service";

type StateActions = {
  showLoadingActivityIndicator: () => any;
  hideLoadingActivityIndicator: () => any;
};

type FirestoreActions = {
  saveObject: (firestoreObject: IFirestoreObject) => Promise<any>;
  deleteObject: (firestoreObject: IFirestoreObject) => Promise<any>;
};
export default class DataSynchronizerService {
  private readonly authGuardService: AuthGuardService;

  private readonly stateActions: StateActions;

  private readonly firestoreActions: FirestoreActions;

  constructor(
    authGuardService: AuthGuardService,
    stateActions: StateActions,
    firestoreActions: FirestoreActions
  ) {
    this.authGuardService = authGuardService;
    this.stateActions = stateActions;
    this.firestoreActions = firestoreActions;
  }

  attachOwnerUuid(
    entity: {
      clone: (override?: Partial<object>) => object;
    },
    allowAnonymous = true
  ): object {
    return entity.clone({
      ownerUid: this.authGuardService.getAuthUserUid(allowAnonymous),
    });
  }

  saveEntity<T>(entity: T, stateUpdater: (sEntity: T) => void): Promise<void> {
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

  deleteEntity<T>(entity: T, stateUpdater: (s: T) => void): Promise<void> {
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
          `Error on saving deleting <${entity.constructor.name}>'${entity.uuid}'`,
          e
        );
        throw e;
      });
  }

  deleteEntityCollection<T>(
    entityCollection: T[],
    stateUpdater: (s: T[]) => void
  ): Promise<void> {
    this.stateActions.showLoadingActivityIndicator();
    const db = DbContext.getInstance().database;
    // delete on local;

    return Promise.all([
      ...entityCollection.map((entity: T) => {
        db.delete(entity).then(() => {
          // delete from firestore
          this.authGuardService.guard(
            () => this.firestoreActions.deleteObject(entity),
            () => Promise.resolve(null)
          );
        });
      }),
    ])
      .then(() => {
        this.stateActions.hideLoadingActivityIndicator();
        stateUpdater(entityCollection);
      })
      .catch((e) => {
        this.stateActions.hideLoadingActivityIndicator();
        console.log(
          `Error on deleting entity collection <${entityCollection[0].constructor.name}>`,
          e
        );
        throw e;
      });

    // return db
    //     .delete(entity)
    //     .then(() => {
    //       // delete from firestore
    //       this.authGuardService
    //           .guard(
    //               () => this.firestoreActions.deleteObject(entity),
    //               () => Promise.resolve(null)
    //           )
    //           .then(() => {
    //             // delete on state
    //             stateUpdater(entity);
    //           });
    //     })
    //     .then(() => {
    //       this.stateActions.hideLoadingActivityIndicator();
    //     })
    //     .catch((e) => {
    //       this.stateActions.hideLoadingActivityIndicator();
    //       console.log(
    //           `Error on saving entity<${entity.constructor.name}>'${entity.uuid}'`,
    //           e
    //       );
    //       throw e;
    //     });
  }
}
