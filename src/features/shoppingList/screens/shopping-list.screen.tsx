import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Button } from "react-native-paper";
import ShoppingLists from "../components/shopping-lists.component";
import { useTypedSelector } from "../../../hooks/useTypedSelector";

function ShoppingListScreen() {
  const { shoppingLists } = useTypedSelector((state) => state.shoppingLists);

  const [shoppingListsOnScreen, setShoppingListsOnScreen] = useState(
    // eslint-disable-next-line comma-dangle
    Array.from(shoppingLists.values())
  );

  useEffect(() => {
    setShoppingListsOnScreen(Array.from(shoppingLists.values()));
  }, [shoppingLists]);

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
