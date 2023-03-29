import { StyleSheet, Text, View } from "react-native";
import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  MaterialCommunityIcons,
  Entypo,
  MaterialIcons,
} from "@expo/vector-icons";
import { IProduct } from "../interfaces/product.interface";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E6E6E6",
    flexDirection: "row",
    height: 45,
    alignSelf: "stretch",
    borderWidth: 1,
    borderColor: "#000000",
  },
  leftContent: {
    backgroundColor: "#E6E6E6",
    alignSelf: "stretch",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  leftIcon: {
    color: "rgba(0,0,0,1)",
    fontSize: 20,
    marginLeft: 10,
    margin: 0,
  },
  label: {
    color: "#121212",
    marginLeft: 10,
    margin: 0,
  },
  rightContent: {
    alignSelf: "stretch",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  addToPantryIcon: {
    color: "rgba(0,0,0,1)",
    fontSize: 25,
    marginLeft: 10,
    margin: 0,
  },
  draggableIcon: {
    color: "rgba(128,128,128,1)",
    fontSize: 20,
    marginLeft: 10,
    margin: 0,
    padding: 0,
    paddingRight: 10,
  },
});

function ProductListItem({ item }: { item: IProduct }) {
  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <MaterialCommunityIcons name="food-apple" style={styles.leftIcon} />
        <Text style={styles.label}>{item.name}</Text>
      </View>
      <View style={styles.rightContent}>
        <Entypo name="box" style={styles.addToPantryIcon} />
        <MaterialIcons name="drag-handle" style={styles.draggableIcon} />
      </View>
    </View>
  );
}

export const ProductListItemKeyExtractor = (p: IProduct) => p.getKey();
export default ProductListItem;
