import * as React from "react";
import { Provider } from "react-redux";

import { NavigationContainer, useNavigation } from "@react-navigation/native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  ActivityIndicator,
  Button,
  MD2Colors,
  Snackbar,
} from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Modal from "react-native-modal";
import { Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ProductScreen from "./features/products/screens/product.screen";
import { store } from "./state";
import BarCodeScanScreen from "./features/products/screens/barcode-scan.screen";
import { useTypedSelector } from "./hooks/useTypedSelector";
import { useActions } from "./hooks/useActions";
import HomeScreen from "./features/home/screens/home.screen";
import NotificationsScreen from "./features/notifications/screens/notifications.screen";
import ConfigurationsScreen from "./features/configurations/screens/configurations.screen";

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
              component={NotificationsScreen}
            />
            <Stack.Screen
              name="ConfigurationsScreen"
              component={ConfigurationsScreen}
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
