import React, { useContext, useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import PantryList from "../components/pantry-list.component";
import { DependencyInjectionContext } from "../../../services/dependencyInjection/dependency-injection.context";

function PantryScreen() {
  const { pantryService, navigationService } = useContext(
    DependencyInjectionContext
  );

  const [currentPantries, setCurrentPantries] = useState(
    pantryService.getPantries()
  );

  useEffect(() => {
    setCurrentPantries(pantryService.getPantries());
  }, [pantryService]);

  const handleAddPantry = () => {
    navigationService.showEditPantryScreen(pantryService.createNewPantry());
  };

  return (
    <View>
      <TouchableOpacity onPress={handleAddPantry}>
        <Button mode="contained">
          <Ionicons name="md-add" />
          Add pantry
        </Button>
      </TouchableOpacity>
      {currentPantries.length > 0 && <PantryList pantries={currentPantries} />}
      {currentPantries.length <= 0 && (
        <Text>There are no pantries saved yet.</Text>
      )}
    </View>
  );
}

export default PantryScreen;
