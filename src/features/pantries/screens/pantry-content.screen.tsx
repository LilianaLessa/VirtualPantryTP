import React, { useContext, useEffect } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import PantryContentProductList from "../components/pantry-content-product-list.component";
import Pantry from "../classes/pantry.class";
import { DependencyInjectionContext } from "../../../services/dependencyInjection/dependency-injection.context";

export type PantryContentScreenParams = {
  PantryContent: {
    pantry: Pantry;
  };
};

type Props = RouteProp<PantryContentScreenParams, "PantryContent">;

export default function PantryContentScreen({
  route: {
    params: { pantry },
  },
}: {
  route: Props;
}) {
  const { pantryService, navigationService } = useContext(
    DependencyInjectionContext
  );

  const navigation = useNavigation();
  useEffect(() => {
    navigationService.setScreenTitle(pantry.name, navigation);
  }, [navigationService, pantry, navigation]);

  const handleStoreProduct = () => {
    navigationService.showStoreProductScreen(
      pantryService.createStoredProduct({
        pantryUuid: pantry.uuid,
      })
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
      <Text>{`Pantry uuid: ${pantry.uuid}`}</Text>
    </View>
  );
}
