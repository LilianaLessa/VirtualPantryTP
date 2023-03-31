import React, { useContext } from "react";
import { TouchableOpacity, View } from "react-native";
import { Button } from "react-native-paper";

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import ProductList from "../components/product-list.component";
import ProductSearchBar from "../components/product-search-bar.component";
import OpenFoodFacts from "../../../services/productDataProvider/OpenFoodFacts";
import { IProduct } from "../interfaces/product.interface";
import { EditProductScreenRouteName } from "./edit-product.screen";
import { useActions } from "../../../hooks/useActions";
import { BarCodeScanScreenRouteName } from "./barcode-scan.screen";
import { BarCodeScannerContext } from "../../../services/barCodeScanner/barCodeScanner.context";

function ProductScreen() {
  const navigation = useNavigation();
  const { setOnBarCodeScannedCallback } = useContext(BarCodeScannerContext);

  const handleAddProduct = () => {
    navigation.navigate("EditProduct" as never);
  };
  const { showErrorSnack } = useActions();
  const onBarCodeScanned = (barCode: string) => {
    new OpenFoodFacts().getProductByBarCode(
      barCode,
      (product: IProduct) => {
        navigation.navigate(
          EditProductScreenRouteName as never,
          {
            product,
            // eslint-disable-next-line comma-dangle
          } as never
        );
      },
      () => {
        showErrorSnack(
          // eslint-disable-next-line comma-dangle
          `Couldn't find a product with the barcode '${barCode}'`
        );
        // eslint-disable-next-line comma-dangle
      }
    );
  };
  const navigateToBarcodeScanScreen = () => {
    setOnBarCodeScannedCallback(onBarCodeScanned);
    navigation.navigate(BarCodeScanScreenRouteName as never);
  };

  return (
    <View>
      <ProductSearchBar barcodeButtonCallback={navigateToBarcodeScanScreen} />
      <TouchableOpacity onPress={handleAddProduct}>
        <Button mode="contained">
          <Ionicons name="md-add" />
          TMP add product
        </Button>
      </TouchableOpacity>
      <ProductList />
    </View>
  );
}

export default ProductScreen;
