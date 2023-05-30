// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React from "react";
import { FlatList, View } from "react-native";
import PantryListItem, {
  PantryListItemKeyExtractor,
} from "./pantry-list-item.component";
import { IPantry } from "../interfaces/pantry.interface";

function PantryList({ pantries }: { pantries: IPantry[] }) {
  const renderItem = ({ item }: { item: IPantry }) => (
    <PantryListItem item={item} />
  );

  return (
    <View>
      <FlatList
        data={pantries}
        renderItem={renderItem}
        keyExtractor={PantryListItemKeyExtractor}
      />
    </View>
  );
}

export default PantryList;
