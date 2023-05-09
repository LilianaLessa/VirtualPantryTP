import { FlatList, Text, View } from "react-native";
import React from "react";
import IShoppingList from "../interfaces/shopping-list.interface";
import ShoppingList from "./shopping-list.component";

function ShoppingLists({ shoppingLists }: { shoppingLists: IShoppingList[] }) {
  const renderItem = ({ item }: { item: IShoppingList }) => (
    <ShoppingList shoppingList={item} />
  );

  const keyExtractor = (i: IShoppingList) => i.getKey();

  return shoppingLists && shoppingLists.length > 0 ? (
    <View>
      <FlatList
        data={shoppingLists}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    </View>
  ) : (
    <View>
      <Text>No shopping lists saved yet.</Text>
    </View>
  );
}

export default ShoppingLists;
