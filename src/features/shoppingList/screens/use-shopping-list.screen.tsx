import React, { useEffect, useState } from "react";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { v4 as uuidv4 } from "uuid";
import { FlatList, View } from "react-native";
import { Button } from "react-native-paper";
import { faker } from "@faker-js/faker";
import IShoppingList from "../interfaces/shopping-list.interface";
import IShoppingListItem from "../interfaces/shopping-list-item.interface";
import ShoppingListItem from "../classes/shopping-list-item.class";
import { useActions } from "../../../hooks/useActions";
import UseShoppingListItem from "../components/use-shopping-list-item";

export type UseShoppingListScreenParams = {
  UseShoppingList: {
    shoppingList: IShoppingList;
  };
};
type Props = RouteProp<UseShoppingListScreenParams, "UseShoppingList">;

function UseShoppingListScreen({ route }: { route: Props }) {
  const { shoppingList } = route.params ?? {};
  const navigation = useNavigation();

  const [items, setItems] = useState(
    (shoppingList?.items ?? []).reduce(
      (map: Map<string, IShoppingListItem>, item: IShoppingListItem) =>
        map.set(item.uuid, item),
      new Map<string, IShoppingListItem>()
    )
  );

  useEffect(() => {
    const screenTitle = shoppingList.name;
    navigation.setOptions({
      title: screenTitle,
    });
  }, [shoppingList, navigation]);

  const { saveShoppingList } = useActions();

  function updateItemsOnShoppingList() {
    shoppingList.items = Array.from(items.values());
    saveShoppingList(shoppingList);
  }

  useEffect(() => {
    updateItemsOnShoppingList();
  }, [items]);

  const handleAddItem = () => {
    const newItem = new ShoppingListItem(uuidv4());
    newItem.name = faker.word.noun();
    newItem.quantity = faker.random.numeric() as unknown as number;
    items.set(newItem.uuid, newItem);
    setItems(new Map(items));
  };

  const storeItem = (uuid: string) => {
    console.log("Store Item", uuid);
  };

  const copyItem = (uuid: string) => {
    const sourceItem = items.get(uuid);
    const copiedItem = new ShoppingListItem(
      uuidv4(),
      sourceItem?.name ?? "",
      sourceItem?.quantity ?? 0,
      sourceItem?.bought ?? false,
      sourceItem?.boughtPrice ?? 0
    );
    items.set(copiedItem.uuid, copiedItem);
    setItems(new Map(items));
  };

  const removeItem = (uuid: string) => {
    items.delete(uuid);
    setItems(new Map(items));
  };

  // todo save shopping list on item add/delete/change

  const renderItem = ({ item }: { item: IShoppingListItem }) => (
    <UseShoppingListItem
      shoppingListItem={item}
      storeItemCallback={storeItem}
      copyItemCallback={copyItem}
      deleteItemCallback={removeItem}
      updateItemCallback={(uuid: string) => updateItemsOnShoppingList()}
    />
  );

  return (
    <View>
      <FlatList
        data={Array.from(items.values())}
        renderItem={renderItem}
        keyExtractor={(i: IShoppingListItem) => i.getKey()}
      />
      <Button mode="contained" onPress={handleAddItem}>
        AddItem
      </Button>
    </View>
  );
}

export default UseShoppingListScreen;
