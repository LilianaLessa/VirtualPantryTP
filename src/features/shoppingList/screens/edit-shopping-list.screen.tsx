import React, { useEffect, useState } from "react";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { v4 as uuidv4 } from "uuid";
import { FlatList, View } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
import { faker } from "@faker-js/faker";
import IShoppingList from "../interfaces/shopping-list.interface";
import ShoppingList from "../classes/shopping-list.class";
import IShoppingListItem from "../interfaces/shopping-list-item.interface";
import ShoppingListItem from "../classes/shopping-list-item.class";
import EditShoppingListItem from "../components/edit-shopping-list-item";
import { useActions } from "../../../hooks/useActions";

export type EditShoppingListScreenParams = {
  EditShoppingList: {
    shoppingList?: IShoppingList;
    isEdit?: boolean;
  };
};
type Props = RouteProp<EditShoppingListScreenParams, "EditShoppingList">;

function EditShoppingListScreen({ route }: { route: Props }) {
  let { shoppingList } = route.params ?? {};
  const { isEdit } = route.params ?? {
    isEdit: false,
  };
  const navigation = useNavigation();

  const [name, setName] = useState(shoppingList?.name ?? "");
  const [items, setItems] = useState(
    (shoppingList?.items ?? []).reduce(
      (map: Map<string, IShoppingListItem>, item: IShoppingListItem) =>
        map.set(item.uuid, item),
      new Map<string, IShoppingListItem>()
    )
  );

  useEffect(() => {
    const screenTitle = isEdit ? "Edit Shopping List" : "Create Shopping List";
    navigation.setOptions({
      title: screenTitle,
    });
  }, [isEdit, navigation]);

  const { saveShoppingList } = useActions();

  const handleShoppingListSave = () => {
    shoppingList = shoppingList ?? new ShoppingList(uuidv4(), name);
    shoppingList.items = Array.from(items.values());

    saveShoppingList(shoppingList);
    navigation.goBack();
  };

  const handleAddItem = () => {
    const newItem = new ShoppingListItem(uuidv4());
    newItem.name = faker.word.noun();
    newItem.quantity = faker.random.numeric() as unknown as number;
    items.set(newItem.uuid, newItem);
    setItems(new Map(items));
  };

  const removeItem = (uuid: string) => {
    items.delete(uuid);
    setItems(new Map(items));
  };

  const renderItem = ({ item }: { item: IShoppingListItem }) => (
    <EditShoppingListItem
      shoppingListItem={item}
      deleteItemCallback={removeItem}
    />
  );

  return (
    <View>
      <TextInput
        mode="outlined"
        label="Shopping List name"
        placeholder="Ex.: My Shopping List"
        value={name}
        onChangeText={(text) => setName(text)}
        style={{ width: "100%" }}
      />
      <HelperText visible type="info" padding="none">
        Type a name for your Shopping List
      </HelperText>
      <FlatList
        data={Array.from(items.values())}
        renderItem={renderItem}
        keyExtractor={(i: IShoppingListItem) => i.getKey()}
      />
      <Button mode="contained" onPress={handleAddItem}>
        AddItem
      </Button>
      <Button mode="contained" onPress={handleShoppingListSave}>
        Save
      </Button>
    </View>
  );
}

export default EditShoppingListScreen;
