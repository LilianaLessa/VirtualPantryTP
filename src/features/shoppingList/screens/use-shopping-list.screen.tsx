import React, { useContext, useEffect, useState } from "react";
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
import { ProductSearchContext } from "../../../services/productSearch/product-search.context";
import Product from "../../products/classes/product.class";
import { saveProduct } from "../../../state/action-creators";
import { StoreProductScreenRouteName } from "../../../infrastructure/navigation/route-names";
import { IProduct } from "../../products/interfaces/product.interface";

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

  const { saveShoppingList, saveProduct } = useActions();

  function updateItemsOnShoppingList() {
    shoppingList.items = Array.from(items.values());
    saveShoppingList(shoppingList);
  }

  useEffect(() => {
    updateItemsOnShoppingList();
  }, [items]);

  const { searchInSavedProducts } = useContext(ProductSearchContext);

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

  const handleStoreProduct = (
    product: IProduct,
    shoppingListItem?: IShoppingListItem
  ) => {
    navigation.navigate(
      StoreProductScreenRouteName as never,
      {
        product,
        shoppingListItem,
      } as never
    );
  };

  const storeItem = (uuid: string) => {
    const item = items.get(uuid);
    const searchResults = searchInSavedProducts(item?.name ?? "");

    let productToStore = searchResults.shift();
    if (typeof productToStore === "undefined") {
      productToStore = new Product(uuidv4());
      productToStore.name = item?.name ?? "";

      saveProduct(productToStore);
    }

    handleStoreProduct(productToStore, item);
    // todo if store is confirmed, delete the shopping list item.
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
