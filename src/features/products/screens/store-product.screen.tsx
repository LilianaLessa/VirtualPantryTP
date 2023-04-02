import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { RouteProp } from "@react-navigation/native";
// eslint-disable-next-line import/no-extraneous-dependencies
import { PaperSelect } from "react-native-paper-select";
// eslint-disable-next-line import/no-extraneous-dependencies
import { list } from "react-native-paper-select/src/interface/paperSelect.interface";
import { useFonts } from "expo-font";
// this is needed to React Native Paper Select
import materialCommunityIconsFont from "react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf";
import { IProduct } from "../interfaces/product.interface";
import { IPantry } from "../../pantries/interfaces/pantry.interface";
import { useTypedSelector } from "../../../hooks/useTypedSelector";

export type StoreProductScreenParams = {
  StoreProduct: {
    product?: IProduct;
    pantry?: IPantry;
  };
};

type Props = RouteProp<StoreProductScreenParams, "StoreProduct">;

function getEntityArrayToSelect(
  // eslint-disable-next-line comma-dangle
  entities: Array<{ uuid: string; name: string }>
): Array<list> {
  return entities.map((p: { uuid: string; name: string }) => ({
    _id: p.uuid,
    value: p.name,
  }));
}

interface SelectedItem {
  text: string;
  selectedList: Array<list>;
}

export default function StoreProductScreen({ route }: { route: Props }) {
  const { product, pantry } = route.params ?? {};
  const { savedProducts } = useTypedSelector((state) => state.savedProducts);
  const { pantries } = useTypedSelector((state) => state.pantries);

  const [products, setProducts] = useState(
    getEntityArrayToSelect(Array.from(savedProducts.values()))
  );
  const [pantriesOnList, setPantriesOnList] = useState(
    getEntityArrayToSelect(Array.from(pantries.values()))
  );
  const [selectedProduct, setSelectedProduct] = useState<IProduct | undefined>(
    product
  );
  const [selectedPantry, setSelectedPantry] = useState<IPantry | undefined>(
    pantry
  );

  useEffect(() => {
    const savedProductsArray = Array.from(savedProducts.values());
    // todo on no product, show create function.
    const firstProduct = savedProductsArray[0] ?? undefined;
    const selectedProductExists =
      selectedProduct && savedProducts.has(selectedProduct.uuid);
    const previouslySelectedProduct = selectedProductExists
      ? selectedProduct
      : firstProduct;

    setProducts(getEntityArrayToSelect(savedProductsArray));
    setSelectedProduct(previouslySelectedProduct);
  }, [savedProducts, selectedProduct]);
  useEffect(() => {
    const pantriesArray = Array.from(pantries.values());
    // todo on no pantry, show create function.
    const firstPantry = pantriesArray[0] ?? undefined;
    const selectedPantryExists =
      selectedPantry && pantries.has(selectedPantry.uuid);
    const previouslySelectedPantry = selectedPantryExists
      ? selectedPantry
      : firstPantry;

    setPantriesOnList(getEntityArrayToSelect(pantriesArray));
    setSelectedPantry(previouslySelectedPantry);
  }, [pantries, selectedPantry]);

  const [materialCommunityIconsFontLoaded] = useFonts({
    MaterialCommunityIcons: materialCommunityIconsFont,
  });

  if (!materialCommunityIconsFontLoaded) {
    // console.log("font not loaded"); //put an activity indicator here?
    return null;
  }

  const handlePantrySelect = (item: SelectedItem) => {
    const firstSelectedItem = item.selectedList[0];
    if (firstSelectedItem) {
      // eslint-disable-next-line no-underscore-dangle
      setSelectedPantry(pantries.get(firstSelectedItem._id));
    }
  };

  const getSelectedPantryOnList = (): list[] =>
    selectedPantry ? getEntityArrayToSelect([selectedPantry]) : [];

  const handleProductSelect = (item: SelectedItem) => {
    const firstSelectedItem = item.selectedList[0];
    if (firstSelectedItem) {
      // eslint-disable-next-line no-underscore-dangle
      setSelectedProduct(savedProducts.get(firstSelectedItem._id));
    }
  };

  const getSelectedProductOnList = (): list[] =>
    selectedProduct ? getEntityArrayToSelect([selectedProduct]) : [];

  return (
    <View>
      <Text>
        Store '{product?.name ?? "undefined"}' on '{pantry?.name ?? "undefined"}
        '.
      </Text>
      <PaperSelect
        label="Pantry"
        value={selectedPantry?.name ?? ""}
        arrayList={[...pantriesOnList]}
        multiEnable={false}
        errorText=""
        selectedArrayList={getSelectedPantryOnList()}
        onSelection={handlePantrySelect}
      />
      <PaperSelect
        label="Product"
        value={selectedProduct?.name ?? ""}
        arrayList={[...products]}
        multiEnable={false}
        errorText=""
        selectedArrayList={getSelectedProductOnList()}
        onSelection={handleProductSelect}
      />
    </View>
  );
}
