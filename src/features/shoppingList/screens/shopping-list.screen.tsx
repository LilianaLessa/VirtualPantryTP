import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Button } from "react-native-paper";
import ShoppingLists from "../components/shopping-lists.component";
import IShoppingList from "../interfaces/shopping-list.interface";

function ShoppingListScreen() {
  const [shoppingListsOnScreen, setShoppingListsOnScreen] = useState<
    IShoppingList[]
  >([]);

  useEffect(() => {
    setShoppingListsOnScreen([]);
  }, []);

  return (
    <View>
      <TouchableOpacity>
        <Button mode="contained">Add Shopping List</Button>
      </TouchableOpacity>
      <ShoppingLists shoppingLists={shoppingListsOnScreen} />
    </View>
  );
}

export default ShoppingListScreen;
