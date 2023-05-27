import { v4 as uuidv4 } from "uuid";
import { QueryConstraint } from "@firebase/firestore";
import { and, where } from "firebase/firestore";
import Group from "../classes/group.class";
import AuthGuardService from "../../../services/firebase/auth-guard.service";
import UserInGroup, {
  UseInGroupAcceptanceState,
} from "../classes/user-in-group.class";
import DbContext from "../../../services/applicationData/localDatabase/classes/db-context.class";
import IFirestoreObject from "../../../services/firebase/interfaces/firestore-object.interface";
import NotificationService from "../../notification/services/notification.service";

type GroupStateActions = {
  saveGroup: (group: Group) => any;
  deleteGroup: (group: Group) => any;
  showLoadingActivityIndicator: () => any;
  hideLoadingActivityIndicator: () => any;
};
type FirestoreActions = {
  saveObject: (firestoreObject: IFirestoreObject) => Promise<any>;
  deleteObject: (firestoreObject: IFirestoreObject) => Promise<any>;
  getObjectByUuid: (
    firestoreCollectionName: string,
    uuid: string
  ) => Promise<any>;
  createCollectionListener: (
    collectionName: string,
    onAdded?: (data: any) => void,
    onModified?: (data: any) => void,
    onRemoved?: (data: any) => void,
    ...queryConstraints: QueryConstraint[]
  ) => () => void;
  findDocuments: (
    collectionName: string,
    ...queryConstraints: QueryConstraint[]
  ) => Promise<any>;
};

export default class GroupService {
  notificationService: NotificationService | null;

  private readonly authGuardService: AuthGuardService;

  groups: Map<string, Group>;

  private readonly stateActions: GroupStateActions;

  private readonly firestoreActions: FirestoreActions;

  private unsubscribeUserFromGroupInvites = () => {};

  private unsubscribeUserFromGroupUpdates = () => {};

  constructor(
    notificationService: NotificationService | null,
    authGuardService: AuthGuardService,
    groups?: Map<string, Group>,
    stateActions?: GroupStateActions,
    firestoreActions?: FirestoreActions
  ) {
    this.notificationService = notificationService;
    this.authGuardService = authGuardService;
    this.groups = groups ?? new Map<string, Group>();
    this.stateActions = stateActions ?? {
      saveGroup: (group: Group) => {},
      deleteGroup: (group: Group) => {},
      showLoadingActivityIndicator: () => {},
      hideLoadingActivityIndicator: () => {},
    };
    this.firestoreActions = firestoreActions ?? {
      saveObject: (firestoreObject: IFirestoreObject) => Promise.resolve(null),
      deleteObject: (firestoreObject: IFirestoreObject) =>
        Promise.resolve(null),
    };

    this.authGuardService.guard(() => {
      console.log(
        `subscribing '${this.authGuardService.getAuthUserEmail()}' to group operations`
      );
      const email = this.authGuardService.getAuthUserEmail();
      const uid = this.authGuardService.getAuthUserUid();
      if (email && uid) {
        this.subscribeUserToGroupInvites(email);
        this.subscribeUserFromGroupUpdates(uid);
      }
    });
  }

  destructor() {
    console.log(
      `unsubscribing '${this.authGuardService.getAuthUserEmail()}' from group operations.`
    );
    this.unsubscribeUserFromGroupInvites();
    this.unsubscribeUserFromGroupUpdates();
  }

  private subscribeUserToGroupInvites(email: string) {
    this.unsubscribeUserFromGroupInvites =
      this.firestoreActions.createCollectionListener(
        UserInGroup.getFirestoreCollectionName(),
        (d) => {
          const userInGroup = UserInGroup.buildFromFirestoreData({
            data: () => d,
          });

          if (this.notificationService !== null) {
            this.getRemoteGroup(userInGroup.groupUuid).then((result) => {
              const group = result.docs.map((d) =>
                Group.buildFromFirestoreData(d)
              )[0];

              if (group) {
                this.notificationService
                  ?.sendGroupInviteNotification(userInGroup, group)
                  .then(() => {
                    this.firestoreActions
                      .getObjectByUuid(
                        UserInGroup.getFirestoreCollectionName(),
                        userInGroup.uuid
                      )
                      .then((r) => {
                        const uig = r.docs.map((d) =>
                          UserInGroup.buildFromFirestoreData(d)
                        )[0];
                        if (uig) {
                          uig.acceptanceState =
                            UseInGroupAcceptanceState.VIEWED;
                          this.firestoreActions.saveObject(uig).then(() => {});
                        }
                      });
                  });
              }
            });
          }

          console.log("added", userInGroup);
        },
        (d) => {
          console.log("modified", d);
        },
        (d) => {
          console.log("removed", d);
        },
        and(
          where("acceptanceState", "==", UseInGroupAcceptanceState.PENDING),
          where("email", "==", email)
        )
      );
  }

  private subscribeUserFromGroupUpdates(uid: string) {
    this.unsubscribeUserFromGroupUpdates =
      this.firestoreActions.createCollectionListener(
        UserInGroup.getFirestoreCollectionName(),
        (d) => {
          const userInGroup = UserInGroup.buildFromFirestoreData({
            data: () => d,
          });

          this.getRemoteGroup(userInGroup.groupUuid)
            .then((r) => {
              const remoteGroup = r.docs.map((d) =>
                Group.buildFromFirestoreData(d)
              )[0];

              console.log(`Member in group '${remoteGroup.name}'.`);

              // todo fix: this loaded data will be overwritten by any state init collection.
              // todo load group related data.

              this.stateActions.saveGroup(remoteGroup);

              // load group data into state.
            })
            .catch((e) => console.log(e));

          // console.log("group update: added", userInGroup);
        },
        (d) => {
          console.log("group update: modified", d);
        },
        (d) => {
          const userInGroup = UserInGroup.buildFromFirestoreData({
            data: () => d,
          });
          this.getRemoteGroup(userInGroup.groupUuid).then((r) => {
            const remoteGroup = r.docs.map((d) =>
              Group.buildFromFirestoreData(d)
            )[0];

            if (remoteGroup) {
              // todo unload group related data.
              this.stateActions.deleteGroup(remoteGroup);
            }
          });

          console.log("group update: removed", d);
        },
        and(
          where("answererUid", "==", uid),
          where("acceptanceState", "==", UseInGroupAcceptanceState.ACCEPTED)
        )
      );
  }

  private getRemoteGroup(remoteGroupUuid: string): Promise<any> {
    return this.firestoreActions.getObjectByUuid(
      Group.getFirestoreCollectionName(),
      remoteGroupUuid
    );
  }

  public createNewGroup(name?: string): Group | never {
    return this.authGuardService.guard(
      () => this.instantiateGroup(name ?? ""),
      () => this.authGuardService.getAuthUserUid()
    );
  }

  public isGroupOwnedByLoggedUser(group: Group): boolean {
    return this.authGuardService.guard(
      () => this.authGuardService.getAuthUserUid(true) === group.ownerUid,
      () => false
    );
  }

  public leaveGroup(
    group: Group,
    successCallback?: () => any,
    errorCallback?: () => any
  ): void {
    this.firestoreActions
      .findDocuments(
        UserInGroup.getFirestoreCollectionName(),
        and(
          where("groupUuid", "==", group.uuid),
          where("acceptanceState", "==", UseInGroupAcceptanceState.ACCEPTED),
          where("answererUid", "==", this.authGuardService.getAuthUserUid())
        )
      )
      .then((r) => {
        const remoteUserInGroup = r.docs.map((d) =>
          UserInGroup.buildFromFirestoreData(d)
        )[0];
        if (remoteUserInGroup) {
          remoteUserInGroup.acceptanceState = UseInGroupAcceptanceState.LEFT;
          this.firestoreActions.saveObject(remoteUserInGroup).then(() => {
            if (successCallback) {
              return successCallback();
            }
          });
        }
      });
    // get from firestore user groups where acceptanceState= 2, groupUUid = group.uuid and answererId = currentUser.uuid.
    // set the acceptanceState of this object to LEFT
    // save the found object at firebase, then remove the group from state. maybe the collection listener can take care of it.
  }

  public saveGroup(
    group: Group,
    updatedGroup: Group,
    successCallback?: () => any,
    errorCallback?: () => any
  ): void {
    if (!this.isGroupOwnedByLoggedUser(group)) {
      if (errorCallback) {
        return errorCallback();
      }
    }
    // todo check if the group is owned by the current user

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
        this.firestoreActions.saveObject(updatedGroup).then((savedGroup) => {
          Promise.all(
            updatedGroup.users.map((userInGroup) =>
              this.firestoreActions.saveObject(userInGroup)
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
      removedUsers.map((u) => this.firestoreActions.deleteObject(u))
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
              this.firestoreActions.deleteObject(group),
              ...group.users.map((userInGroup) =>
                this.firestoreActions.deleteObject(userInGroup)
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
    isInviter: boolean,
    acceptanceState: UseInGroupAcceptanceState
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
          acceptanceState,
          undefined,
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

  answerInvite(userInGroupUuid: string, acceptInvite: boolean): Promise<any> {
    return this.firestoreActions
      .getObjectByUuid(
        UserInGroup.getFirestoreCollectionName(),
        userInGroupUuid
      )
      .then((r) => {
        const uig = r.docs.map((d) => UserInGroup.buildFromFirestoreData(d))[0];
        if (uig) {
          uig.acceptanceState = acceptInvite
            ? UseInGroupAcceptanceState.ACCEPTED
            : UseInGroupAcceptanceState.REJECTED;
          uig.answererUid = this.authGuardService.getAuthUserUid();

          return this.firestoreActions.saveObject(uig);
        }
        return Promise.resolve();
      });
  }
}
