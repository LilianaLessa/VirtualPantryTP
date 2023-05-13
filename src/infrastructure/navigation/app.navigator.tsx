import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  ProductSearchResultScreen,
  ProductSearchResultsScreenParams,
} from "../../features/products/screens/product-search-results.screen";
import {
  EditProductScreen,
  EditProductScreenParams,
} from "../../features/products/screens/edit-product.screen";
import HomeScreen from "../../features/home/screens/home.screen";
import {
  AccountScreenRouteName,
  BarCodeScanScreenRouteName,
  ConfigurationsScreenRouteName,
  CreateAccountScreenRouteName,
  EditGroupScreenRouteName,
  EditPantryScreenRouteName,
  EditProductScreenRouteName,
  EditShoppingListScreenRouteName,
  GroupsScreenRouteName,
  HomeScreenRouteName,
  NotificationsScreenRouteName,
  PantriesScreenRouteName,
  PantryContentScreenRouteName,
  ProductScreenRouteName,
  ProductSearchResultScreenRouteName,
  ShoppingListsRouteName,
  StoreProductScreenRouteName,
  UseShoppingListScreenRouteName,
} from "./route-names";
import ProductScreen from "../../features/products/screens/product.screen";
import BarCodeScanScreen from "../../features/products/screens/barcode-scan.screen";
import { ScreenPlaceHolder } from "../../dev-utils";
import HeaderLeftActions from "./components/header-left-actions.component";
import HeaderRightActions from "./components/header-right-actions.component";
import PantryScreen from "../../features/pantries/screens/pantry.screen";
import {
  EditPantryScreen,
  EditPantryScreenParams,
} from "../../features/pantries/screens/edit-pantry.screen";
import StoreProductScreen, {
  StoreProductScreenParams,
} from "../../features/products/screens/store-product.screen";
import PantryContentScreen from "../../features/pantries/screens/pantry-content.screen";
import ConfigurationScreen from "../../features/configuration/screens/configuration.screen";
import NotificationScreen from "../../features/notification/screens/notification.screen";
import ShoppingListScreen from "../../features/shoppingList/screens/shopping-list.screen";
import EditShoppingListScreen, {
  EditShoppingListScreenParams,
} from "../../features/shoppingList/screens/edit-shopping-list.screen";
import UseShoppingListScreen from "../../features/shoppingList/screens/use-shopping-list.screen";
import AccountScreen from "../../features/account/screens/account.screen";
import AccountCreateScreen from "../../features/account/screens/account-create.screen";
import GroupsScreen from "../../features/group/screens/groups.screen";
import { DependencyInjectionContext } from "../../services/dependencyInjection/dependency-injection.context";
import EditGroupScreen from "../../features/group/screens/edit-group.screen";

type RootStackParamList =
  | { Home: undefined }
  | { Products: undefined }
  | { NotificationsScreen: { screenName: string } }
  | { ConfigurationsScreen: { screenName: string } }
  | { ShoppingLists: { screenName: string } }
  | { Groups: { screenName: string } }
  | ProductSearchResultsScreenParams
  | EditProductScreenParams
  | EditPantryScreenParams
  | StoreProductScreenParams
  | EditShoppingListScreenParams;

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
  const { groupService, authGuardService, navigationService } = useContext(
    DependencyInjectionContext
  );

  return (
    <Stack.Navigator initialRouteName={HomeScreenRouteName as never}>
      <Stack.Screen
        name={HomeScreenRouteName as never}
        component={HomeScreen}
        options={{
          headerLeft: HeaderLeftActions,
          headerRight: HeaderRightActions,
        }}
      />
      <Stack.Screen
        name={ProductScreenRouteName as never}
        component={ProductScreen}
        options={{
          headerLeft: HeaderLeftActions,
          headerRight: HeaderRightActions,
        }}
      />
      <Stack.Screen
        name={EditProductScreenRouteName as never}
        component={EditProductScreen}
        options={{
          headerLeft: HeaderLeftActions,
          headerRight: HeaderRightActions,
        }}
      />
      <Stack.Screen
        name={StoreProductScreenRouteName as never}
        component={StoreProductScreen}
        options={{
          headerLeft: HeaderLeftActions,
          headerRight: HeaderRightActions,
        }}
      />
      <Stack.Screen
        name={PantriesScreenRouteName as never}
        component={PantryScreen}
        options={{
          headerLeft: HeaderLeftActions,
          headerRight: HeaderRightActions,
        }}
      />
      <Stack.Screen
        name={EditPantryScreenRouteName as never}
        component={EditPantryScreen}
        options={{
          headerLeft: HeaderLeftActions,
          headerRight: HeaderRightActions,
        }}
      />
      <Stack.Screen
        name={PantryContentScreenRouteName as never}
        component={PantryContentScreen}
        options={{
          headerLeft: HeaderLeftActions,
          headerRight: HeaderRightActions,
        }}
      />
      <Stack.Screen
        name={BarCodeScanScreenRouteName as never}
        component={BarCodeScanScreen}
      />
      <Stack.Screen
        name={NotificationsScreenRouteName as never}
        component={NotificationScreen}
        initialParams={{ screenName: "Notifications" } as never}
        options={{
          headerLeft: HeaderLeftActions,
        }}
      />
      <Stack.Screen
        name={ConfigurationsScreenRouteName as never}
        component={ConfigurationScreen}
      />
      <Stack.Screen
        name={ShoppingListsRouteName as never}
        component={ShoppingListScreen}
        options={{
          headerLeft: HeaderLeftActions,
          headerRight: HeaderRightActions,
        }}
      />
      <Stack.Screen
        name={EditShoppingListScreenRouteName as never}
        component={EditShoppingListScreen}
        options={{
          headerLeft: HeaderLeftActions,
          headerRight: HeaderRightActions,
        }}
      />
      <Stack.Screen
        name={UseShoppingListScreenRouteName as never}
        component={UseShoppingListScreen}
        options={{
          headerLeft: HeaderLeftActions,
          headerRight: HeaderRightActions,
        }}
      />
      <Stack.Screen
        name={GroupsScreenRouteName as never}
        component={GroupsScreen}
        initialParams={{ groupService, authGuardService } as never}
        options={{
          headerLeft: HeaderLeftActions,
          headerRight: HeaderRightActions,
        }}
      />
      <Stack.Screen
        name={EditGroupScreenRouteName as never}
        component={EditGroupScreen}
        initialParams={{ groupService } as never}
        options={{
          headerLeft: HeaderLeftActions,
          headerRight: HeaderRightActions,
        }}
      />
      <Stack.Screen
        name={ProductSearchResultScreenRouteName as never}
        component={ProductSearchResultScreen}
        options={{
          headerLeft: HeaderLeftActions,
          headerRight: HeaderRightActions,
        }}
      />
      <Stack.Screen
        name={AccountScreenRouteName as never}
        component={AccountScreen}
        options={{
          headerLeft: HeaderLeftActions,
          headerRight: HeaderRightActions,
        }}
      />
      <Stack.Screen
        name={CreateAccountScreenRouteName as never}
        component={AccountCreateScreen}
        options={{
          headerLeft: HeaderLeftActions,
          headerRight: HeaderRightActions,
        }}
      />
    </Stack.Navigator>
  );
}

export default AppNavigator;
