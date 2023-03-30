import * as React from "react";
import { Provider } from "react-redux";

import { NavigationContainer } from "@react-navigation/native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, MD2Colors, Snackbar } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Modal from "react-native-modal";
import ProductScreen from "./features/products/screens/product.screen";
import { store } from "./state";
import BarCodeScanScreen from "./features/products/screens/barcode-scan.screen";
import { useTypedSelector } from "./hooks/useTypedSelector";
import { useActions } from "./hooks/useActions";

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

function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Provider store={store}>
          <Stack.Navigator initialRouteName="Products">
            <Stack.Screen name="Products" component={ProductScreen} />
            <Stack.Screen
              name="BarCodeScanScreen"
              component={BarCodeScanScreen}
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
