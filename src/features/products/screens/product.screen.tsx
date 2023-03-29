import React from "react";
import { View } from "react-native";

import ProductList from "../components/product-list.component";
import ProductSearchBar from "../components/product-search-bar.component";

function ProductScreen() {
  return (
    <View>
      <ProductSearchBar />
      <ProductList />
    </View>
  );
}

export default ProductScreen;
