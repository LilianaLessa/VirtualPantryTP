import React, { useContext, useEffect, useState } from "react";
import { RouteProp } from "@react-navigation/native";
import { FlatList, View } from "react-native";
import ShoppingList from "../classes/shopping-list.class";
import ShoppingListItem from "../classes/shopping-list-item.class";
import { DependencyInjectionContext } from "../../../services/dependencyInjection/dependency-injection.context";
import UseShoppingListItem from "../components/use-shopping-list-item";

export type UseShoppingListScreenParams = {
  UseShoppingList: {
    shoppingList: ShoppingList;
  };
};
type Props = RouteProp<UseShoppingListScreenParams, "UseShoppingList">;

function UseShoppingListScreen({
  route: {
    params: { shoppingList },
  },
}: {
  route: Props;
}) {
  const { shoppingListService } = useContext(DependencyInjectionContext);
  const [items, setItems] = useState(
    shoppingListService.getItemsOnShoppingList(shoppingList)
  );

  useEffect(() => {
    setItems(shoppingListService.getItemsOnShoppingList(shoppingList));
  }, [shoppingList, shoppingListService]);

  const renderItem = ({ item }: { item: ShoppingListItem }) => (
    <UseShoppingListItem shoppingListItem={item} />
  );

  return (
    <View>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(i: ShoppingListItem) => i.getKey()}
      />
    </View>
  );
}

export default UseShoppingListScreen;
