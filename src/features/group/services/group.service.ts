import { v4 as uuidv4 } from "uuid";
import Group from "../classes/group.class";
import AuthGuardService from "../../../services/firebase/auth-guard.service";
import UserInGroup from "../classes/user-in-group.class";

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
    // save locally
    // then save to firebase
    // then save to state
    this.stateActions.saveGroup(group);

    const callback = successCallback;
    if (callback) {
      return callback();
    }
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
