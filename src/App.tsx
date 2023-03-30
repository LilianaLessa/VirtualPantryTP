import * as React from "react";
import { Provider } from "react-redux";
// eslint-disable-next-line import/no-extraneous-dependencies
import { NavigationContainer } from "@react-navigation/native";
// eslint-disable-next-line import/no-extraneous-dependencies
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProductScreen from "./features/products/screens/product.screen";
import { store } from "./state";
import BarCodeScanScreen from "./features/products/screens/barcode-scan.screen";

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Provider store={store}>
        <Stack.Navigator initialRouteName="Products">
          <Stack.Screen name="Products" component={ProductScreen} />
          <Stack.Screen
            name="BarCodeScanScreen"
            component={BarCodeScanScreen}
          />
        </Stack.Navigator>
      </Provider>
    </NavigationContainer>
  );
}

export default App;
