import * as React from "react";
import { Provider } from "react-redux";
import { NavigationContainer, useNavigation } from "@react-navigation/native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, MD2Colors, Snackbar } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Modal from "react-native-modal";
import { TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { store } from "./state";
import { useTypedSelector } from "./hooks/useTypedSelector";
import { useActions } from "./hooks/useActions";
import HomeScreen from "./features/home/screens/home.screen";
import { ScreenPlaceHolder } from "./dev-utils";
import {
  EditProductScreen,
  EditProductScreenParams,
} from "./features/products/screens/edit-product.screen";

import { BarCodeScannerContextProvider } from "./services/barCodeScanner/barCodeScanner.context";
import {
  ProductSearchResultScreen,
  ProductSearchResultsScreenParams,
} from "./features/products/screens/product-search-results.screen";
import {
  BarCodeScanScreenRouteName,
  EditProductScreenRouteName,
  ProductScreenRouteName,
  ProductSearchResultScreenRouteName,
} from "./infrastructure/navigation/route-names";
import ProductScreen from "./features/products/screens/product.screen";
import BarCodeScanScreen from "./features/products/screens/barcode-scan.screen";

function LoadingModal() {
  const { fetchingData } = useTypedSelector((state) => state.apiActivity);
  return (
    <Modal isVisible={fetchingData}>
      <ActivityIndicator animating color={MD2Colors.red800} size="large" />
    </Modal>
  );
}

function ErrorSnack() {
  const { errorVisible, errorMessage } = useTypedSelector(
    // eslint-disable-next-line comma-dangle
    (state) => state.messageSnackbar
  );
  const { hideErrorSnack } = useActions();

  return (
    <Snackbar
      style={{
        backgroundColor: "#B22D1D",
      }}
      visible={errorVisible}
      onDismiss={() => hideErrorSnack()}
      action={{
        label: "Dismiss",
        onPress: () => hideErrorSnack(),
      }}
      duration={7000}
    >
      {errorMessage}
    </Snackbar>
  );
}

function InfoSnack() {
  const { infoVisible, infoMessage } = useTypedSelector(
    // eslint-disable-next-line comma-dangle
    (state) => state.messageSnackbar
  );
  const { hideInfoSnack } = useActions();

  return (
    <Snackbar
      visible={infoVisible}
      onDismiss={() => hideInfoSnack()}
      action={{
        label: "Dismiss",
        onPress: () => hideInfoSnack(),
      }}
      duration={3000}
    >
      {infoMessage}
    </Snackbar>
  );
}

function HeaderLeftActions() {
  const navigation = useNavigation();

  return (
    <View>
      <TouchableOpacity
        onPress={() => navigation.navigate("ConfigurationsScreen" as never)}
      >
        <MaterialCommunityIcons name="menu" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
}

function HeaderRightActions() {
  const navigation = useNavigation();

  return (
    <View>
      <TouchableOpacity
        onPress={() => navigation.navigate("NotificationsScreen" as never)}
      >
        <MaterialCommunityIcons name="bell" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
}

type RootStackParamList =
  | { Home: undefined }
  | { Products: undefined }
  | { BarCodeScanScreen: undefined }
  | { NotificationsScreen: { screenName: string } }
  | { ConfigurationsScreen: { screenName: string } }
  | { Pantries: { screenName: string } }
  | { ShoppingLists: { screenName: string } }
  | { Groups: { screenName: string } }
  | ProductSearchResultsScreenParams
  | EditProductScreenParams;

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Provider store={store}>
          <BarCodeScannerContextProvider>
            <Stack.Navigator initialRouteName="Home">
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{
                  headerLeft: () => <HeaderLeftActions />,
                  headerRight: () => <HeaderRightActions />,
                }}
              />
              <Stack.Screen
                name={ProductScreenRouteName as never}
                component={ProductScreen}
                options={{
                  headerRight: () => <HeaderRightActions />,
                }}
              />
              <Stack.Screen
                name={BarCodeScanScreenRouteName as never}
                component={BarCodeScanScreen}
              />
              <Stack.Screen
                name="NotificationsScreen"
                component={ScreenPlaceHolder}
                initialParams={{ screenName: "Notifications" }}
              />
              <Stack.Screen
                name="ConfigurationsScreen"
                component={ScreenPlaceHolder}
                initialParams={{ screenName: "Configurations" }}
              />
              <Stack.Screen
                name="Pantries"
                component={ScreenPlaceHolder}
                initialParams={{ screenName: "Pantries" }}
                options={{
                  headerRight: () => <HeaderRightActions />,
                }}
              />
              <Stack.Screen
                name="ShoppingLists"
                component={ScreenPlaceHolder}
                initialParams={{ screenName: "Shopping Lists" }}
                options={{
                  headerRight: () => <HeaderRightActions />,
                }}
              />
              <Stack.Screen
                name="Groups"
                component={ScreenPlaceHolder}
                initialParams={{ screenName: "Groups" }}
                options={{
                  headerRight: () => <HeaderRightActions />,
                }}
              />
              <Stack.Screen
                name={EditProductScreenRouteName as never}
                component={EditProductScreen}
                options={{
                  headerRight: () => <HeaderRightActions />,
                }}
              />
              <Stack.Screen
                name={ProductSearchResultScreenRouteName as never}
                component={ProductSearchResultScreen}
                options={{
                  headerRight: () => <HeaderRightActions />,
                }}
              />
            </Stack.Navigator>
            <LoadingModal />
            <ErrorSnack />
            <InfoSnack />
          </BarCodeScannerContextProvider>
        </Provider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
