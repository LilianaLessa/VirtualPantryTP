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
  },
  leftContent: {
    backgroundColor: "#E6E6E6",
    alignSelf: "stretch",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  listItemIcon: {
    color: "rgba(0,0,0,1)",
    fontSize: 20,
    marginLeft: 10,
    margin: 0,
  },
  label: {
    // fontFamily: "roboto-regular",
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
  action1Icon: {
    color: "rgba(0,0,0,1)",
    fontSize: 25,
    marginLeft: 10,
    margin: 0,
  },
  handlerIcon: {
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
        <MaterialCommunityIcons name="food-apple" style={styles.listItemIcon} />
        <Text style={styles.label}>{item.name}</Text>
      </View>
      <View
        style={[
          styles.rightContent,
          {
            backgroundColor: "#E6E6E6",
          },
        ]}
      >
        <Entypo name="box" style={styles.action1Icon} />
        <MaterialIcons name="drag-handle" style={styles.handlerIcon} />
      </View>
    </View>
  );
}

export const ProductListItemKeyExtractor = (p: IProduct) => p.name;
export default ProductListItem;
