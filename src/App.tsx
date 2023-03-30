import * as React from "react";
import { Provider } from "react-redux";

import { NavigationContainer, useNavigation } from "@react-navigation/native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, MD2Colors, Snackbar } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Modal from "react-native-modal";
import { TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ProductScreen from "./features/products/screens/product.screen";
import { store } from "./state";
import BarCodeScanScreen from "./features/products/screens/barcode-scan.screen";
import { useTypedSelector } from "./hooks/useTypedSelector";
import { useActions } from "./hooks/useActions";
import HomeScreen from "./features/home/screens/home.screen";
import { ScreenPlaceHolder } from "./dev-utils";

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

const Stack = createNativeStackNavigator();

function HeaderLeftActions() {
  const navigation = useNavigation();

  return (
    <View>
      <TouchableOpacity
        onPress={() => navigation.navigate("ConfigurationsScreen")}
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
        onPress={() => navigation.navigate("NotificationsScreen")}
      >
        <MaterialCommunityIcons name="bell" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Provider store={store}>
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
              name="Products"
              component={ProductScreen}
              options={{
                headerRight: () => <HeaderRightActions />,
              }}
            />
            <Stack.Screen
              name="BarCodeScanScreen"
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
          </Stack.Navigator>
          <LoadingModal />
          <ErrorSnack />
          <InfoSnack />
        </Provider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
