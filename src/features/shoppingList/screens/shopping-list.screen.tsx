import React, { useContext, useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Button } from "react-native-paper";
import ShoppingLists from "../components/shopping-lists.component";
import { DependencyInjectionContext } from "../../../services/dependencyInjection/dependency-injection.context";

function ShoppingListScreen() {
  const { navigationService, shoppingListService } = useContext(
    DependencyInjectionContext
  );

  const [shoppingLists, setShoppingLists] = useState(
    shoppingListService.getShoppingLists()
  );

  useEffect(() => {
    setShoppingLists(shoppingListService.getShoppingLists());
  }, [shoppingListService]);

  const handleAddShoppingList = () => {
    navigationService.showEditShoppingListScreen(
      shoppingListService.createNewShoppingList()
    );
  };

  return (
    <View>
      <TouchableOpacity onPress={handleAddShoppingList}>
        <Button mode="contained">Add Shopping List</Button>
      </TouchableOpacity>
      <ShoppingLists shoppingLists={shoppingLists} />
    </View>
  );
}

export default ShoppingListScreen;
