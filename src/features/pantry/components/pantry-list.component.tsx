import React from "react";
import { FlatList, View } from "react-native";
import PantryListItem, {
  PantryListItemKeyExtractor,
} from "./pantry-list-item.component";
import { IPantry } from "../interfaces/pantry.interface";

function PantryList({ pantries }: { pantries: IPantry[] }) {
  return (
    <View>
      <FlatList
        data={pantries}
        renderItem={PantryListItem}
        keyExtractor={PantryListItemKeyExtractor}
      />
    </View>
  );
}

export default PantryList;
