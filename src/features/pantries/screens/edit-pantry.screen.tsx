import { View } from "react-native";
import React, { useEffect, useState } from "react";
import { RouteProp, useNavigation } from "@react-navigation/native";
// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 as uuidv4 } from "uuid";
import { Button, HelperText, TextInput } from "react-native-paper";
import { useActions } from "../../../hooks/useActions";
import { IPantry } from "../interfaces/pantry.interface";
import Pantry from "../classes/pantry.class";

export type EditPantryScreenParams = {
  EditPantry: {
    pantry?: IPantry;
    isEdit?: boolean;
  };
};
type Props = RouteProp<EditPantryScreenParams, "EditPantry">;

export function EditPantryScreen({ route }: { route: Props }) {
  let { pantry } = route.params ?? {};
  const { isEdit } = route.params ?? { isEdit: false };
  const navigation = useNavigation();
  const [name, setName] = useState(pantry?.name ?? "");
  const { savePantry } = useActions();

  useEffect(() => {
    const screenTitle = isEdit ? "Edit Pantry" : "Create Pantry";
    navigation.setOptions({
      title: screenTitle,
    });
  }, [isEdit, navigation]);

  const handlePantrySave = () => {
    pantry = pantry ?? new Pantry(uuidv4());
    pantry.name = name;

    savePantry(pantry);

    navigation.goBack();
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
      <Button mode="contained" onPress={handlePantrySave}>
        Save
      </Button>
    </View>
  );
}
