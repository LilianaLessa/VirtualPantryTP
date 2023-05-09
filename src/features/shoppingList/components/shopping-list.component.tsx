import React from "react";
import { Text, View } from "react-native";
import IShoppingList from "../interfaces/shopping-list.interface";

function ShoppingList({ shoppingList }: { shoppingList: IShoppingList }) {
  return (
    <View>
      <Text>{shoppingList.name}</Text>
    </View>
  );
}

export default ShoppingList;
