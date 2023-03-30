import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Button } from "react-native-paper";

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import ProductList from "../components/product-list.component";
import ProductSearchBar from "../components/product-search-bar.component";
import { useActions } from "../../../hooks/useActions";
import { createMockProduct } from "../../../dev-utils";

function ProductScreen() {
  const navigation = useNavigation();

  const { saveProduct } = useActions();
  const handleAddProduct = () => {
    saveProduct(createMockProduct());
  };

  const navigateToBarcodeScanScreen = () => {
    navigation.navigate("BarCodeScanScreen");
  };

  return (
    <View>
      <ProductSearchBar barcodeButtonCallback={navigateToBarcodeScanScreen} />
      <TouchableOpacity onPress={handleAddProduct}>
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
