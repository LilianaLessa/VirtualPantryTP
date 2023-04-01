import React from "react";
import { FlatList, View } from "react-native";
import PantryListItem, {
  PantryListItemKeyExtractor,
} from "./pantry-list-item.component";
import { IPantry } from "../interfaces/pantry.interface";
import { useActions } from "../../../hooks/useActions";

function PantryList({ pantries }: { pantries: IPantry[] }) {
  const { deletePantry } = useActions();

  const deletePantryCallback = (item: IPantry) => deletePantry(item);

  const renderItem = ({ item }: { item: IPantry }) => (
    <PantryListItem item={item} deletePantryCallback={deletePantryCallback} />
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
