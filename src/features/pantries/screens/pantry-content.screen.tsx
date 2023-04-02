import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import PantryContentProductList from "../components/pantry-content-product-list.component";
import { StoreProductScreenRouteName } from "../../../infrastructure/navigation/route-names";
import { useTypedSelector } from "../../../hooks/useTypedSelector";
import { IPantry } from "../interfaces/pantry.interface";

export type PantryContentScreenParams = {
  PantryContent: {
    pantry: IPantry;
  };
};

type Props = RouteProp<PantryContentScreenParams, "PantryContent">;

export default function PantryContentScreen({ route }: { route: Props }) {
  const navigation = useNavigation();
  const { pantry } = route.params ?? {};

  const { storedProductsByPantryUuid } = useTypedSelector(
    (state) => state.storedProductsByPantryUuid
  );

  const [pantryToRender, setPantryToRender] = useState(
    storedProductsByPantryUuid.get(pantry.uuid)
  );

  useEffect(() => {
    setPantryToRender(storedProductsByPantryUuid.get(pantry.uuid));
  }, [storedProductsByPantryUuid]);

  if (!pantryToRender) {
    return (
      <View>
        <Text>Are you trying to freeze the fire?</Text>
        <Text>Can&apos;t show the content of an undefined pantry.</Text>
      </View>
    );
  }

  const handleStoreProduct = () => {
    navigation.navigate(
      StoreProductScreenRouteName as never,
      {
        pantry,
        // eslint-disable-next-line comma-dangle
      } as never
    );
  };

  return (
    <View>
      <TouchableOpacity onPress={handleStoreProduct}>
        <Button mode="contained">
          <Ionicons name="md-add" />
          Add product to pantry
        </Button>
      </TouchableOpacity>

      <PantryContentProductList pantry={pantry} />
    </View>
  );
}
