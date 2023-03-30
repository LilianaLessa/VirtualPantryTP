import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { faker } from "@faker-js/faker";
import { useActions } from "../../../hooks/useActions";
import Product from "../classes/product.class";

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

interface IProductSearchBarProps {
  style?: React.CSSProperties;
  barcodeButtonCallback: () => void;
}

// eslint-disable-next-line react/function-component-definition
const ProductSearchBar: React.FC<IProductSearchBarProps> = ({
  barcodeButtonCallback,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { saveProduct } = useActions();

  const searchProductByBarCode = async (barcode: string) => {
    axios
      .get(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`)
      .then((response) => {
        const { data } = response;
        try {
          const { code, product, status_verbose } = data;
          const { product_name } = product;

          saveProduct(new Product(uuidv4(), product_name));

          console.log(code, product_name, status_verbose, "success response");
        } catch (e) {
          console.log(data, "exception on response");
        }
      })
      .catch((error) => {
        console.log(error, "error response");
      });
  };

  const searchProduct = () => {
    console.log(searchQuery);
    searchProductByBarCode(searchQuery);
    setSearchQuery("");
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
        <TouchableOpacity onPress={barcodeButtonCallback}>
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
