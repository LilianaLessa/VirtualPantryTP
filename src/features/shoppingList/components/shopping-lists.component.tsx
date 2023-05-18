import { FlatList, Text, View } from "react-native";
import React from "react";
import ShoppingList from "../classes/shopping-list.class";
import { default as ShoppingListComponent } from "./shopping-list.component";

export default function ShoppingLists({
  shoppingLists,
}: {
  shoppingLists: ShoppingList[];
}) {
  const renderItem = ({ item }: { item: ShoppingList }) => (
    <ShoppingListComponent shoppingList={item} />
  );

  return shoppingLists && shoppingLists.length > 0 ? (
    <View>
      <FlatList
        data={shoppingLists}
        renderItem={renderItem}
        keyExtractor={(i: ShoppingList) => i.getKey()}
      />
    </View>
  ) : (
    <View>
      <Text>No shopping lists saved yet.</Text>
    </View>
  );
}
