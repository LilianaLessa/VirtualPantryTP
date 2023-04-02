import React from "react";
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
  BarCodeScanScreenRouteName,
  ConfigurationsScreenRouteName,
  EditPantryScreenRouteName,
  EditProductScreenRouteName,
  GroupsRouteName,
  HomeScreenRouteName,
  NotificationsScreenRouteName,
  PantriesScreenRouteName,
  PantryContentScreenRouteName,
  ProductScreenRouteName,
  ProductSearchResultScreenRouteName,
  ShoppingListsRouteName,
  StoreProductScreenRouteName,
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
  | StoreProductScreenParams;

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName={StoreProductScreen as never}>
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
        component={ScreenPlaceHolder}
        initialParams={{ screenName: "Notifications" } as never}
        options={{
          headerLeft: HeaderLeftActions,
        }}
      />
      <Stack.Screen
        name={ConfigurationsScreenRouteName as never}
        component={ScreenPlaceHolder}
        initialParams={{ screenName: "Configurations" } as never}
      />
      <Stack.Screen
        name={ShoppingListsRouteName as never}
        component={ScreenPlaceHolder}
        initialParams={{ screenName: "Shopping Lists" } as never}
        options={{
          headerLeft: HeaderLeftActions,
          headerRight: HeaderRightActions,
        }}
      />
      <Stack.Screen
        name={GroupsRouteName as never}
        component={ScreenPlaceHolder}
        initialParams={{ screenName: "Groups" } as never}
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
    </Stack.Navigator>
  );
}

export default AppNavigator;
