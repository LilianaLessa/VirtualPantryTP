import React, { useContext, useEffect, useState } from "react";
import { RouteProp } from "@react-navigation/native";
import { FlatList, View } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
import { DependencyInjectionContext } from "../../../services/dependencyInjection/dependency-injection.context";
import EditShoppingListItem from "../components/edit-shopping-list-item";
import ShoppingList from "../classes/shopping-list.class";
import ShoppingListItem from "../classes/shopping-list-item.class";
import ProductSearchBar from "../../products/components/product-search-bar.component";
import Product from "../../products/classes/product.class";

export type EditShoppingListScreenParams = {
  EditShoppingList: {
    shoppingList: ShoppingList;
  };
};
type Props = RouteProp<EditShoppingListScreenParams, "EditShoppingList">;

function EditShoppingListScreen({
  route: {
    params: { shoppingList },
  },
}: {
  route: Props;
}) {
  const { shoppingListService, navigationService, snackBarService } =
    useContext(DependencyInjectionContext);

  const [name, setName] = useState(shoppingList.name);

  function getInitialShoppingListItems() {
    const currentItems = shoppingListService
      .getItemsOnShoppingList(shoppingList)
      .map((i) => i.clone());

    return currentItems.length > 0
      ? currentItems
      : shoppingListService.generateSuggestedItems(shoppingList);
  }

  const [items, setItems] = useState(getInitialShoppingListItems());

  useEffect(() => {
    setName(shoppingList.name);
    setItems(getInitialShoppingListItems());
  }, [shoppingList, shoppingListService]);

  const handleShoppingListSave = () => {
    const updatedShoppingList = shoppingList.clone({
      name,
    });

    const currentItemsUuids = items.map((i) => i.uuid);
    const deletedItems = items.filter(
      (i) => !currentItemsUuids.includes(i.uuid)
    );

    Promise.all([
      shoppingListService.saveShoppingList(updatedShoppingList),
      ...items.map((i) => shoppingListService.saveShoppingListItem(i)),
      ...deletedItems.map((i) => shoppingListService.deleteShoppingListItem(i)),
    ])
      .then(() => {
        navigationService.goBack();
        snackBarService.showShoppingListSavedInfo(updatedShoppingList);
      })
      .catch((e) => {});
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      shoppingListService.createNewShoppingListItem(shoppingList),
    ]);
  };

  const removeItem = (item: ShoppingListItem) => {
    setItems(items.filter((i) => i.uuid !== item.uuid));
  };

  const renderItem = ({ item }: { item: ShoppingListItem }) => (
    <EditShoppingListItem
      shoppingListItem={item}
      removeItemCallback={removeItem}
    />
  );

  const addItemToShoppingListCallback = (product: Product) => {
    setItems([
      ...items,
      shoppingListService.createNewShoppingListItem(shoppingList, {
        name: product.name,
      }),
    ]);
    navigationService.goBack();
  };

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
        data={items}
        renderItem={renderItem}
        keyExtractor={(i: ShoppingListItem) => i.getKey()}
      />
      <ProductSearchBar
        addItemToShoppingListCallback={addItemToShoppingListCallback}
      />
      <Button mode="contained" onPress={handleAddItem}>
        Add Item
      </Button>
      <Button mode="contained" onPress={handleShoppingListSave}>
        Save
      </Button>
    </View>
  );
}

export default EditShoppingListScreen;
