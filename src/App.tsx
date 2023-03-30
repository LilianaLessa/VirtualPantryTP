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

function LoadingModal() {
  const { fetchingData } = useTypedSelector((state) => state.apiActivity);
  return (
    <Modal isVisible={fetchingData}>
      <ActivityIndicator animating color={MD2Colors.red800} size="large" />
    </Modal>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  const [visible, setVisible] = React.useState(true);

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
          <Snackbar
            visible={visible}
            onDismiss={() => setVisible(false)}
            action={{
              label: "Dismiss",
              onPress: () => setVisible(false),
            }}
            duration={3000}
          >
            Hey there! I am a Snackbar.
          </Snackbar>
          <LoadingModal />
        </Provider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
