import { NavigationProp } from "@react-navigation/core/src/types";
import Group from "../../../features/group/classes/group.class";
import {
  AccountScreenRouteName,
  EditGroupScreenRouteName,
  EditProductScreenRouteName,
  GroupsScreenRouteName,
  ProductScreenRouteName,
} from "../route-names";
import Product from "../../../features/products/classes/product.class";

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

  public showEditProductScreen(product: Product) {
    this.navigation?.navigate(
      EditProductScreenRouteName as never,
      {
        product,
      } as never
    );
  }

  public showProductsScreen() {
    this.navigation?.navigate(ProductScreenRouteName as never);
  }

  public showAccountScreen(): void {
    this.navigation?.navigate(AccountScreenRouteName as never);
  }

  public showGroupsScreen(): void {
    this.navigation?.navigate(GroupsScreenRouteName as never);
  }
}
