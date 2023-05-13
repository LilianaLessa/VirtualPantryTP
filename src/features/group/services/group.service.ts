import { v4 as uuidv4 } from "uuid";
import Group from "../classes/group.class";
import AuthGuardService from "../../../services/firebase/auth-guard.service";

export default class GroupService {
  private readonly authGuardService: AuthGuardService;

  constructor(authGuardService: AuthGuardService) {
    this.authGuardService = authGuardService;
  }

  public createNewGroup(name?: string): Group | never {
    return this.authGuardService.guard(
      () => this.instantiateGroup(name ?? ""),
      () => this.authGuardService.getAuthUserUid()
    );
  }

  public saveGroup(
    group: Group,
    overrideProperties: Partial<Group>,
    successCallback?: () => any,
    errorCallback?: () => any
  ): void {
    console.log("implement GroupService.saveGroup");

    const callback = successCallback;
    if (callback) {
      return callback();
    }
  }

  public getGroupsForCurrentUser(): Group[] {
    return this.authGuardService.guard(
      () => [
        this.createNewGroup("group 1"),
        this.createNewGroup("group 2"),
        this.createNewGroup("group 3"),
      ],
      () => Array<Group>()
    );
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
