import React, { useContext, useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
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
      <PantryList pantries={currentPantries} />
    </View>
  );
}

export default PantryScreen;
