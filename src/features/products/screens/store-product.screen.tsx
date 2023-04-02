import React, { useEffect, useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
// eslint-disable-next-line import/no-extraneous-dependencies
import { PaperSelect } from "react-native-paper-select";
// eslint-disable-next-line import/no-extraneous-dependencies
import { list } from "react-native-paper-select/src/interface/paperSelect.interface";
import { useFonts } from "expo-font";
// this is needed to React Native Paper Select
import materialCommunityIconsFont from "react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf";
import styled from "styled-components";
import { Button, HelperText, TextInput } from "react-native-paper";
// eslint-disable-next-line import/no-unresolved
import { SelectedItem } from "react-native-paper-select/lib/typescript/interface/paperSelect.interface";
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  enGB,
  registerTranslation,
  /**
   * todo on this component, scrolling year list on
   *      the full-screen date picker triggers on cosole the message
   *      'VirtualizedList: You have a large list that is slow to update'.
   *      Find a way to fix this.
   */
  DatePickerInput,
} from "react-native-paper-dates";
import { v4 as uuidv4 } from "uuid";
import { IProduct } from "../interfaces/product.interface";
import { IPantry } from "../../pantries/interfaces/pantry.interface";
import { useTypedSelector } from "../../../hooks/useTypedSelector";
import { BarCodeScanIcon } from "../components/product-search-bar.styles";
import StoredProduct from "../classes/stored-product.class";
import { useActions } from "../../../hooks/useActions";

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

// todo margin-right should depend on the screen size.
const SelectProductContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  margin-right: 35px;
`;

export default function StoreProductScreen({ route }: { route: Props }) {
  registerTranslation("enGB", enGB);
  const navigation = useNavigation();
  const { product, pantry } = route.params ?? {};
  const { savedProducts } = useTypedSelector((state) => state.savedProducts);
  const { pantries } = useTypedSelector((state) => state.pantries);
  const { savePantry } = useActions();

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

  // todo fetch product on pantry from redux?
  const [quantity, setQuantity] = useState(1);
  const [bestBefore, setBestBefore] = useState(new Date());
  const [storedAt, setStoredAt] = useState(new Date());
  const [boughtPrice, setBoughtPrice] = useState(0);

  useEffect(() => {
    const savedProductsArray = Array.from(savedProducts.values());
    // todo on no product, offer create product.
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
    // todo on no pantry, offer create pantry.
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

  const handleProductOnPantrySave = () => {
    // todo save button should be disabled if selectedProduct or selectedPantry are null
    // todo input fields should be disabled if selectedProduct is null
    if (selectedProduct && selectedPantry) {
      // todo pick new or edit an existing one.
      const productToStore = new StoredProduct(
        uuidv4(),
        selectedProduct,
        selectedPantry,
        quantity,
        bestBefore,
        storedAt,
        boughtPrice
      );

      selectedPantry.storeProduct(productToStore);
      savePantry(
        selectedPantry,
        `Product '${selectedProduct.name}' added to pantry '${selectedPantry.name}'`
      );

      navigation.goBack();
    }
  };

  return (
    <View>
      <PaperSelect
        label="Pantry"
        value={selectedPantry?.name ?? ""}
        arrayList={[...pantriesOnList]}
        multiEnable={false}
        errorText=""
        selectedArrayList={getSelectedPantryOnList()}
        onSelection={handlePantrySelect}
      />
      <SelectProductContainer>
        <PaperSelect
          label="Product"
          value={selectedProduct?.name ?? ""}
          arrayList={[...products]}
          multiEnable={false}
          errorText=""
          selectedArrayList={getSelectedProductOnList()}
          onSelection={handleProductSelect}
        />
        <TouchableOpacity>
          <BarCodeScanIcon style={{ color: "red" }} />
        </TouchableOpacity>
      </SelectProductContainer>
      <TextInput
        disabled={!selectedProduct}
        mode="outlined"
        label="Quantity"
        placeholder="Ex.: Kilo"
        value={quantity.toString()}
        onChangeText={(text) => setQuantity(text as unknown as number)}
        keyboardType="numeric"
        style={{ width: "100%" }}
      />
      <HelperText visible type="info" padding="none">
        Set the product quantity to store
      </HelperText>
      <DatePickerInput
        disabled={!selectedProduct}
        locale="enGB"
        label="Best before"
        value={bestBefore}
        onChange={(d) => setBestBefore(d ?? new Date())}
        inputMode="start"
      />
      <HelperText visible type="info" padding="none">
        The date until which the product should be consumed.
      </HelperText>
      <DatePickerInput
        disabled={!selectedProduct}
        locale="enGB"
        label="Stored at"
        value={storedAt}
        onChange={(d) => setStoredAt(d ?? new Date())}
        inputMode="start"
      />
      <HelperText visible type="info" padding="none">
        The date when the product was stored in the pantry.
      </HelperText>
      <TextInput
        disabled={!selectedProduct}
        mode="outlined"
        label="Bought Price"
        placeholder="Ex.: Kilo"
        value={boughtPrice.toString()}
        onChangeText={(text) => setBoughtPrice(text as unknown as number)}
        keyboardType="numeric"
        style={{ width: "100%" }}
      />
      <HelperText visible type="info" padding="none">
        Set the price of the product when you bought it.
      </HelperText>
      <Button mode="contained" onPress={handleProductOnPantrySave}>
        Save
      </Button>
    </View>
  );
}
