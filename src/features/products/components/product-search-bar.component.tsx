// eslint-disable-next-line object-curly-newline
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import React, { useContext, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ProductSearchResultScreenRouteName } from "../screens/product-search-results.screen";
import { IProduct } from "../interfaces/product.interface";
import { BarCodeScanScreenRouteName } from "../screens/barcode-scan.screen";
import { BarCodeScannerContext } from "../../../services/barCodeScanner/barCodeScanner.context";

const searchBarStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFEFF4",
    padding: 8,
    paddingRight: 0,
    height: 50,
  },
  inputBox: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#CECED2",
    borderRadius: 5,
    padding: 0,
    margin: 0,
    marginRight: 7,
  },
  inputLeftIcon: {
    color: "#000",
    fontSize: 20,
    alignSelf: "center",
    paddingLeft: 5,
    paddingRight: 5,
    margin: 0,
  },
  inputStyle: {
    height: 32,
    alignSelf: "flex-start",
    fontSize: 15,
    lineHeight: 15,
    color: "#000",
    flex: 1,
    margin: 0,
  },
  icon: {
    color: "#000",
    fontSize: 20,
    alignSelf: "center",
    paddingLeft: 5,
    paddingRight: 5,
    margin: 0,
  },
});

// eslint-disable-next-line react/function-component-definition
const ProductSearchBar = ({ products }: { products: IProduct[] }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();

  const { setOnBarCodeScannedCallback } = useContext(BarCodeScannerContext);

  const searchProductByBarCode = (barCode: string) => {
    const results = products.filter(
      (product: IProduct) => product.barCode === barCode
    );
    navigation.navigate(
      ProductSearchResultScreenRouteName as never,
      {
        results,
        barCode,
      } as never
    );
  };

  const onBarCodeScanned = (barCode: string) => {
    searchProductByBarCode(barCode);
  };
  const navigateToBarcodeScanScreen = () => {
    setOnBarCodeScannedCallback(onBarCodeScanned);
    navigation.navigate(BarCodeScanScreenRouteName as never);
  };

  const searchProductByTerm = (term: string) => {
    const results = products.filter((product: IProduct) =>
      product.name.toLowerCase().includes(term.toLowerCase())
    );
    navigation.navigate(
      ProductSearchResultScreenRouteName as never,
      {
        results,
        term,
      } as never
    );
  };

  const searchProduct = () => {
    const term = searchQuery;
    setSearchQuery("");
    searchProductByTerm(term);
  };

  return (
    <View style={[searchBarStyles.container]}>
      <View style={searchBarStyles.inputBox}>
        <MaterialCommunityIcons
          name="magnify"
          style={searchBarStyles.inputLeftIcon}
        />
        <TextInput
          placeholder="Search"
          style={searchBarStyles.inputStyle}
          value={searchQuery}
          onChangeText={(v) => setSearchQuery(v)}
          onSubmitEditing={searchProduct}
        />
        <TouchableOpacity onPress={navigateToBarcodeScanScreen}>
          <MaterialCommunityIcons
            name="barcode-scan"
            style={searchBarStyles.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default ProductSearchBar;
