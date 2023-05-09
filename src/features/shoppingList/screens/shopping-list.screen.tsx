import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import ShoppingLists from "../components/shopping-lists.component";
import { useTypedSelector } from "../../../hooks/useTypedSelector";
import { EditShoppingListScreenRouteName } from "../../../infrastructure/navigation/route-names";
import { useActions } from "../../../hooks/useActions";

function ShoppingListScreen() {
  const navigation = useNavigation();
  const { shoppingLists } = useTypedSelector((state) => state.shoppingLists);

  const [shoppingListsOnScreen, setShoppingListsOnScreen] = useState(
    // eslint-disable-next-line comma-dangle
    Array.from(shoppingLists.values())
  );

  const { deleteShoppingList } = useActions();

  useEffect(() => {
    setShoppingListsOnScreen(Array.from(shoppingLists.values()));
  }, [shoppingLists]);

  const handleAddShoppingList = () => {
    navigation.navigate(EditShoppingListScreenRouteName as never);
  };

  return (
    <View>
      <TouchableOpacity onPress={handleAddShoppingList}>
        <Button mode="contained">Add Shopping List</Button>
      </TouchableOpacity>
      <ShoppingLists
        shoppingLists={shoppingListsOnScreen}
        deleteShoppingListCallback={deleteShoppingList}
      />
    </View>
  );
}

export default ShoppingListScreen;
