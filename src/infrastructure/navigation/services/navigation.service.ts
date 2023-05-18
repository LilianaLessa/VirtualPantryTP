import { NavigationProp } from "@react-navigation/core/src/types";
import Group from "../../../features/group/classes/group.class";
import {
  AccountScreenRouteName,
  BarCodeScanScreenRouteName,
  EditGroupScreenRouteName,
  EditPantryScreenRouteName,
  EditProductScreenRouteName,
  EditShoppingListScreenRouteName,
  GroupsScreenRouteName,
  PantriesScreenRouteName,
  PantryContentScreenRouteName,
  ProductScreenRouteName,
  ProductSearchResultScreenRouteName,
  StoreProductScreenRouteName,
  UseShoppingListScreenRouteName,
} from "../route-names";
import Product from "../../../features/products/classes/product.class";
import { ProductSearchQuery } from "../../../features/products/services/product.service";
import Pantry from "../../../features/pantries/classes/pantry.class";
import StoredProduct from "../../../features/products/classes/stored.product";
import ShoppingList from "../../../features/shoppingList/classes/shopping-list.class";

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

  public showProductSearchResultScreen(
    products: Product[],
    query: Partial<ProductSearchQuery>
  ) {
    this.navigation?.navigate(
      ProductSearchResultScreenRouteName as never,
      {
        products,
        query,
      } as never
    );
  }

  public showBarCodeScanScreen() {
    this.navigation?.navigate(BarCodeScanScreenRouteName as never);
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

  public showEditPantryScreen(pantry: Pantry): void {
    this.navigation?.navigate(
      EditPantryScreenRouteName as never,
      { pantry } as never
    );
  }

  public showPantryScreen(): void {
    this.navigation?.navigate(PantriesScreenRouteName as never);
  }

  public showStoreProductScreen(storedProduct: StoredProduct): void {
    this.navigation?.navigate(
      StoreProductScreenRouteName as never,
      {
        storedProduct,
      } as never
    );
  }

  public showPantryContentScreen(pantry: Pantry): void {
    this.navigation?.navigate(
      PantryContentScreenRouteName as never,
      {
        pantry,
      } as never
    );
  }

  showEditShoppingListScreen(shoppingList: ShoppingList): void {
    this.navigation?.navigate(
      EditShoppingListScreenRouteName as never,
      {
        shoppingList,
      } as never
    );
  }

  showUseShoppingListScreen(shoppingList: ShoppingList): void {
    this.navigation?.navigate(
      UseShoppingListScreenRouteName as never,
      {
        shoppingList,
      } as never
    );
  }

  setScreenTitle(title: string, screenNavigation: any): void {
    screenNavigation.setOptions({ title });
  }

  public goBack(): void {
    this.navigation?.goBack();
  }
}
