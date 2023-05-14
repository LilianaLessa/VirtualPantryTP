import { NavigationProp } from "@react-navigation/core/src/types";
import Group from "../../../features/group/classes/group.class";
import {
  AccountScreenRouteName,
  EditGroupScreenRouteName,
  GroupsScreenRouteName,
} from "../route-names";

export default class NavigationService {
  private readonly navigation?: NavigationProp<ReactNavigation.RootParamList>;

  constructor(navigation?: NavigationProp<ReactNavigation.RootParamList>) {
    this.navigation = navigation;
  }

  // todo this should be the target screen params
  public showGroupEditScreen(group: Group): void {
    this.navigation?.navigate(
      EditGroupScreenRouteName as never,
      {
        group,
      } as never
    );
  }

  public showAccountScreen(): void {
    this.navigation?.navigate(AccountScreenRouteName as never);
  }

  public showGroupsScreen(): void {
    this.navigation?.navigate(GroupsScreenRouteName as never);
  }
}
