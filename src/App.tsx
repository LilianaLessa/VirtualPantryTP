import * as React from "react";
import { StyleSheet, View } from "react-native";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Provider } from "react-redux";
import ProductScreen from "./features/products/screens/product.screen";
import { store } from "./state";

const styles = StyleSheet.create({
  basic: {
    marginTop: 50,
  },
});

function App() {
  return (
    <Provider store={store}>
      <View style={styles.basic}>
        <ProductScreen />
      </View>
    </Provider>
  );
}

export default App;
