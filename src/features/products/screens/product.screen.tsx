import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Button } from "react-native-paper";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Ionicons } from "@expo/vector-icons";
import ProductList from "../components/product-list.component";
import ProductSearchBar from "../components/product-search-bar.component";
import Product from "../classes/product.class";
import { useActions } from "../../../hooks/useActions";

function ProductScreen() {
  const { saveProduct } = useActions();
  const createMockProduct = () => {
    const newProduct = new Product("testaaa");
    saveProduct(newProduct);
  };

  return (
    <View>
      <ProductSearchBar />
      <TouchableOpacity onPress={createMockProduct}>
        <Button mode="elevated">
          <Ionicons name="md-add" />
          TMP add product
        </Button>
      </TouchableOpacity>
      <ProductList />
    </View>
  );
}

export default ProductScreen;
