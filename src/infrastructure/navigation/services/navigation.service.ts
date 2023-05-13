import Group from "../../../features/group/classes/group.class";
import { HomeScreenRouteName } from "../route-names";

// todo using this service causes non serializable value exception during navigation. fix it.
export default class NavigationService {
  private readonly navigation?: any;

  constructor(navigation?: any) {
    this.navigation = navigation;
  }

  // todo this should be the target screen params
  public navigateToGroupEditScreen(group: Group): void {
    this.navigateToMockScreen("test");
  }

  private navigateToMockScreen(screenName: string) {
    if (this.navigation?.navigate) {
      this.navigation.navigate(HomeScreenRouteName as never);
    }
  }
}
