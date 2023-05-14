import { v4 as uuidv4 } from "uuid";
import Group from "../classes/group.class";
import AuthGuardService from "../../../services/firebase/auth-guard.service";
import UserInGroup from "../classes/user-in-group.class";
import DbContext from "../../../services/applicationData/localDatabase/classes/db-context.class";

type GroupStateActions = { saveGroup: (group: Group) => any };

export default class GroupService {
  private readonly authGuardService: AuthGuardService;

  private readonly groups: Map<string, Group>;

  private readonly stateActions: GroupStateActions;

  constructor(
    authGuardService: AuthGuardService,
    groups?: Map<string, Group>,
    stateActions?: GroupStateActions
  ) {
    this.authGuardService = authGuardService;
    this.groups = groups ?? new Map<string, Group>();
    this.stateActions = stateActions ?? { saveGroup: (group: Group) => {} };
  }

  public createNewGroup(name?: string): Group | never {
    return this.authGuardService.guard(
      () => this.instantiateGroup(name ?? ""),
      () => this.authGuardService.getAuthUserUid()
    );
  }

  public saveGroup(
    group: Group,
    successCallback?: () => any,
    errorCallback?: () => any
  ): void {
    const db = DbContext.getInstance().database;
    console.log("saving group");
    db.save(group as Group)
      .then(() => {
        console.log("saving users");
        Promise.all(
          group.users.map((userInGroup) => db.save(userInGroup as UserInGroup))
        )
          .then(() => {
            console.log("todo save at firebase");
            // save at firebase.
            // after, save at state.
            console.log("save at state");
            this.stateActions.saveGroup(group);
            if (successCallback) {
              return successCallback();
            }
          })
          .catch((e) => {
            console.log(`error on saving group ${group.uuid} locally`, e);
            if (errorCallback) {
              return errorCallback();
            }
          });
      })
      .catch((e) => {
        console.log(`error on saving group ${group.uuid} locally`, e);
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
