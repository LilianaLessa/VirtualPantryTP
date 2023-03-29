import { StyleSheet, TextInput, View } from "react-native";
import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { MaterialCommunityIcons } from "@expo/vector-icons";

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
}

// eslint-disable-next-line react/function-component-definition
const ProductSearchBar: React.FC<IProductSearchBarProps> = () => (
  <View style={[searchBarStyles.container]}>
    <View style={searchBarStyles.inputBox}>
      <MaterialCommunityIcons
        name="magnify"
        style={searchBarStyles.inputLeftIcon}
      />
      <TextInput placeholder="Search" style={searchBarStyles.inputStyle} />
      <MaterialCommunityIcons
        name="barcode-scan"
        style={searchBarStyles.icon}
      />
    </View>
  </View>
);

export default ProductSearchBar;
