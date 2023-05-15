import { Text, View } from "react-native";
import React, { useContext, useState } from "react";
import { RouteProp } from "@react-navigation/native";
import { Button, HelperText, TextInput } from "react-native-paper";
import Pantry from "../classes/pantry.class";
import { DependencyInjectionContext } from "../../../services/dependencyInjection/dependency-injection.context";

export type EditPantryScreenParams = {
  EditPantry: {
    pantry: Pantry;
  };
};
type Props = RouteProp<EditPantryScreenParams, "EditPantry">;

export function EditPantryScreen({
  route: {
    params: { pantry },
  },
}: {
  route: Props;
}) {
  const { pantryService, navigationService, snackBarService } = useContext(
    DependencyInjectionContext
  );
  const [name, setName] = useState(pantry.name);

  const handleSave = () => {
    const updatedPantry = pantry.clone({
      name,
    });

    pantryService.savePantry(updatedPantry, () => {
      navigationService.showPantryScreen();
      snackBarService.showPantrySavedInfo(updatedPantry);
    });
  };

  return (
    <View>
      <TextInput
        mode="outlined"
        label="Pantry name"
        placeholder="Ex.: My Pantry"
        value={name}
        onChangeText={(text) => setName(text)}
        style={{ width: "100%" }}
      />
      <HelperText visible type="info" padding="none">
        Type a name for your pantry
      </HelperText>
      <Button mode="contained" onPress={handleSave}>
        Save
      </Button>
      <Text>{`Owner UID: ${pantry?.ownerUid}`}</Text>
      <Text>{`Firestore ID: ${pantry?.firestoreId}`}</Text>
    </View>
  );
}
