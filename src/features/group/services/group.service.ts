import { v4 as uuidv4 } from "uuid";
import Group from "../classes/group.class";
import AuthGuardService from "../../../services/firebase/auth-guard.service";
import UserInGroup from "../classes/user-in-group.class";
import DbContext from "../../../services/applicationData/localDatabase/classes/db-context.class";
import IFirestoreObject from "../../../services/firebase/interfaces/firestore-object.interface";

type GroupStateActions = {
  saveGroup: (group: Group) => any;
  deleteGroup: (group: Group) => any;
  showLoadingActivityIndicator: () => any;
  hideLoadingActivityIndicator: () => any;
};
type FirestoreContext = {
  saveObject: (firestoreObject: IFirestoreObject) => Promise<any>;
  deleteObject: (firestoreObject: IFirestoreObject) => Promise<any>;
};

export default class GroupService {
  private readonly authGuardService: AuthGuardService;

  private readonly groups: Map<string, Group>;

  private readonly stateActions: GroupStateActions;

  private readonly firestoreContext: FirestoreContext;

  constructor(
    authGuardService: AuthGuardService,
    groups?: Map<string, Group>,
    stateActions?: GroupStateActions,
    firestoreContext?: FirestoreContext
  ) {
    this.authGuardService = authGuardService;
    this.groups = groups ?? new Map<string, Group>();
    this.stateActions = stateActions ?? {
      saveGroup: (group: Group) => {},
      deleteGroup: (group: Group) => {},
      showLoadingActivityIndicator: () => {},
      hideLoadingActivityIndicator: () => {},
    };
    this.firestoreContext = firestoreContext ?? {
      saveObject: (firestoreObject: IFirestoreObject) => Promise.resolve(null),
      deleteObject: (firestoreObject: IFirestoreObject) =>
        Promise.resolve(null),
    };
  }

  public createNewGroup(name?: string): Group | never {
    return this.authGuardService.guard(
      () => this.instantiateGroup(name ?? ""),
      () => this.authGuardService.getAuthUserUid()
    );
  }

  public saveGroup(
    group: Group,
    updatedGroup: Group,
    successCallback?: () => any,
    errorCallback?: () => any
  ): void {
    this.stateActions.showLoadingActivityIndicator();
    const db = DbContext.getInstance().database;

    const updatedGroupUserUuids = updatedGroup.users.map((u) => u.uuid);
    const removedUsers = group.users.filter(
      (x) => !updatedGroupUserUuids.includes(x.uuid)
    );

    const saveGroup = db.save(updatedGroup as Group).then(() => {
      Promise.all(
        updatedGroup.users.map((userInGroup) =>
          db.save(userInGroup as UserInGroup)
        )
      ).then(() => {
        this.firestoreContext.saveObject(updatedGroup).then((savedGroup) => {
          Promise.all(
            updatedGroup.users.map((userInGroup) =>
              this.firestoreContext.saveObject(userInGroup)
            )
          ).then((savedUsers) => {
            savedUsers.forEach((savedUser: UserInGroup) => {
              updatedGroup.setUser(savedUser);
            });
            Promise.all([
              db.save(updatedGroup as Group),
              ...updatedGroup.users.map((userInGroup) =>
                db.save(userInGroup as UserInGroup)
              ),
            ]);
          });
        });
      });
    });

    const deleteUsersOnFirestore = Promise.all(
      removedUsers.map((u) => this.firestoreContext.deleteObject(u))
    );

    const deleteUsersOnLocalStorage = Promise.all(
      removedUsers.map((u) => db.delete(u as UserInGroup))
    );

    Promise.all([saveGroup, deleteUsersOnFirestore, deleteUsersOnLocalStorage])
      .then(() => {
        this.stateActions.saveGroup(updatedGroup);
        this.stateActions.hideLoadingActivityIndicator();
        if (successCallback) {
          return successCallback();
        }
      })
      .catch((e) => {
        this.stateActions.hideLoadingActivityIndicator();
        console.log(`error on saving group ${updatedGroup.uuid}`, e);
        if (errorCallback) {
          return errorCallback();
        }
      });
  }

  public deleteGroup(
    group: Group,
    successCallback?: () => any,
    errorCallback?: () => any
  ): void {
    this.stateActions.showLoadingActivityIndicator();
    const db = DbContext.getInstance().database;
    db.delete(group as Group)
      .then(() =>
        Promise.all(
          group.users.map((userInGroup) =>
            db.delete(userInGroup as UserInGroup)
          )
        )
          .then(() =>
            Promise.all([
              this.firestoreContext.deleteObject(group),
              ...group.users.map((userInGroup) =>
                this.firestoreContext.deleteObject(userInGroup)
              ),
            ])
          )
          .catch((e) => {
            this.stateActions.hideLoadingActivityIndicator();
            console.log(`1 error on deleting group ${group.uuid}`, e);
            if (errorCallback) {
              return errorCallback();
            }
          })
      )
      .then(() => {
        this.stateActions.deleteGroup(group);
        this.stateActions.hideLoadingActivityIndicator();
        if (successCallback) {
          return successCallback();
        }
      })
      .catch((e) => {
        this.stateActions.hideLoadingActivityIndicator();
        console.log(`2 error on deleting group ${group.uuid}`, e);
        if (errorCallback) {
          return errorCallback();
        }
      });
  }

  public getGroupsForCurrentUser(): Group[] {
    return Array.from(this.groups.values());
  }

  setUser(
    group: Group,
    email: string,
    isAdmin: boolean,
    isInviter: boolean
  ): void {
    if (email.length >= 3) {
      group.setUser(
        new UserInGroup(
          uuidv4(),
          group.ownerUid,
          group.uuid,
          email,
          isAdmin,
          isInviter,
          undefined,
          undefined,
          new Date().toString()
        )
      );
    }
  }

  dropDb() {
    // todo remove debug method
    const db = DbContext.getInstance().database;

    db.dropTables().then(() => db.setUpDataBase());
  }

  private instantiateGroup(name: string) {
    return new Group(
      uuidv4(),
      name,
      this.authGuardService.getAuthUserUid(),
      undefined,
      undefined,
      new Date().toString()
    );
  }
}
