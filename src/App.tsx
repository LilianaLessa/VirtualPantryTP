import * as React from "react";
import { StyleSheet, View } from "react-native";
import ProductScreen from "./features/products/screens/product.screen";

const styles = StyleSheet.create({
  basic: {
    marginTop: 50,
  },
});

function App() {
  return (
    <View style={styles.basic}>
      <ProductScreen />
    </View>
  );
}

export default App;
