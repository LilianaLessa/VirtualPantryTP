import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, View } from "react-native";
import { Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useTypedSelector } from "../../../hooks/useTypedSelector";
import PantryList from "../components/pantry-list.component";
import { EditPantryScreenRouteName } from "../../../infrastructure/navigation/route-names";

function PantryScreen() {
  const navigation = useNavigation();
  const { pantries } = useTypedSelector((state) => state.pantries);
  const [pantriesOnList, setPantriesOnList] = useState(
    Array.from(pantries.values())
  );

  useEffect(() => {
    setPantriesOnList(Array.from(pantries.values()));
  }, [pantries]);

  const handleAddPantry = () => {
    navigation.navigate(EditPantryScreenRouteName as never);
  };

  return (
    <View>
      <TouchableOpacity onPress={handleAddPantry}>
        <Button mode="contained">
          <Ionicons name="md-add" />
          Add pantry
        </Button>
      </TouchableOpacity>
      <PantryList pantries={pantriesOnList} />
    </View>
  );
}

export default PantryScreen;
