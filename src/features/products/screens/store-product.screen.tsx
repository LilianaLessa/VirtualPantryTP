import React, { useContext, useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { RouteProp } from "@react-navigation/native";

import { PaperSelect } from "react-native-paper-select";

import { list } from "react-native-paper-select/src/interface/paperSelect.interface";
import { useFonts } from "expo-font";
// this is needed to React Native Paper Select
import materialCommunityIconsFont from "react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf";
import styled from "styled-components";
import { Button, HelperText, TextInput } from "react-native-paper";
// eslint-disable-next-line import/no-unresolved
import { SelectedItem } from "react-native-paper-select/lib/typescript/interface/paperSelect.interface";

import {
  /**
   * todo on this component, scrolling year list on
   *      the full-screen date picker triggers on cosole the message
   *      'VirtualizedList: You have a large list that is slow to update'.
   *      Find a way to fix this.
   */
  DatePickerInput,
  enGB,
  registerTranslation,
} from "react-native-paper-dates";
import { BarCodeScanIcon } from "../components/product-search-bar.styles";
import StoredProduct from "../classes/stored.product";
import { DependencyInjectionContext } from "../../../services/dependencyInjection/dependency-injection.context";
import Product from "../classes/product.class";
import Pantry from "../../pantries/classes/pantry.class";

function toList(
  // eslint-disable-next-line comma-dangle
  entities: { uuid: string; name: string }[]
): list[] {
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

export type StoreProductScreenParams = {
  StoreProduct: {
    storedProduct: StoredProduct;
  };
};

type Props = RouteProp<StoreProductScreenParams, "StoreProduct">;

export default function StoreProductScreen({
  route: {
    params: { storedProduct },
  },
}: {
  route: Props;
}) {
  registerTranslation("enGB", enGB);
  const [materialCommunityIconsFontLoaded] = useFonts({
    MaterialCommunityIcons: materialCommunityIconsFont,
  });

  const {
    productService,
    pantryService,
    barCodeScanService,
    navigationService,
    snackBarService,
  } = useContext(DependencyInjectionContext);

  // select states
  const [products, setProducts] = useState(productService.getProducts());
  useEffect(() => {
    setProducts(productService.getProducts());
  }, [productService]);
  const [pantries, setPantries] = useState(pantryService.getPantries());
  useEffect(() => {
    setPantries(pantryService.getPantries());
  }, [pantryService]);

  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(
    productService.getProductByUuid(storedProduct.productUuid)
  );
  const [selectedPantry, setSelectedPantry] = useState<Pantry | undefined>(
    pantryService.getPantryByUuid(storedProduct.pantryUuid)
  );

  // form states
  const [name, setName] = useState(storedProduct.name ?? selectedProduct?.name);
  const [quantity, setQuantity] = useState(storedProduct.quantity);
  const [bestBefore, setBestBefore] = useState(
    storedProduct.bestBefore ? new Date(storedProduct.bestBefore) : new Date()
  );
  const [storedAt, setStoredAt] = useState(
    storedProduct.storedAt ? new Date(storedProduct.storedAt) : new Date()
  );
  const [boughtPrice, setBoughtPrice] = useState(storedProduct.boughtPrice);

  const [prepared, setPrepared] = useState(storedProduct.prepared);
  useEffect(() => {
    setPrepared(storedProduct.prepared);
  }, [storedProduct]);
  const [eaten, setEaten] = useState(storedProduct.eaten);
  useEffect(() => {
    setEaten(storedProduct.eaten);
  }, [storedProduct]);
  const [expired, setExpired] = useState(storedProduct.expired);
  useEffect(() => {
    setExpired(storedProduct.expired);
  }, [storedProduct]);
  const [discarded, setDiscarded] = useState(storedProduct.discarded);
  useEffect(() => {
    setDiscarded(storedProduct.discarded);
  }, [storedProduct]);

  if (!materialCommunityIconsFontLoaded) {
    // console.log("font not loaded"); //todo put an activity indicator here?
    return null;
  }

  const getSelectedPantryOnList = (): list[] =>
    selectedPantry ? toList([selectedPantry]) : [];

  const handlePantrySelect = (item: SelectedItem) => {
    setSelectedPantry(
      // eslint-disable-next-line no-underscore-dangle
      pantryService.getPantryByUuid(item?.selectedList[0]?._id)
    );
  };

  const handleProductSelect = (item: SelectedItem) => {
    setSelectedProduct(
      // eslint-disable-next-line no-underscore-dangle
      productService.getProductByUuid(item?.selectedList[0]?._id)
    );
  };

  const getSelectedProductOnList = (): list[] =>
    selectedProduct ? toList([selectedProduct]) : [];

  const handleStore = () => {
    const updatedStoredProduct = storedProduct.clone({
      name,
      quantity,
      boughtPrice,
      bestBefore: bestBefore.toString(),
      storedAt: storedAt.toString(),
      productUuid: selectedProduct?.uuid,
      pantryUuid: selectedPantry?.uuid,
      prepared,
      eaten,
      expired,
      discarded,
    });
    pantryService.storeProduct(updatedStoredProduct, () => {
      navigationService.goBack();
      snackBarService.showProductStoredInfo(
        storedProduct,
        pantryService.getPantryByUuid(updatedStoredProduct.pantryUuid),
        productService.getProductByUuid(updatedStoredProduct.productUuid)
      );
    });
  };

  const handleProductSelectBarcodePress = () => {
    barCodeScanService.scanBarCode((barCode: string) => {
      setSelectedProduct(productService.searchProducts({ barCode })[0]);
    });
  };

  return (
    <View>
      <ScrollView>
        <PaperSelect
          label="Select a Pantry"
          value={selectedPantry?.name ?? ""}
          arrayList={toList(pantries)}
          multiEnable={false}
          errorText=""
          selectedArrayList={getSelectedPantryOnList()}
          onSelection={handlePantrySelect}
        />
        <SelectProductContainer>
          <PaperSelect
            label="Select a Product"
            value={selectedProduct?.name ?? ""}
            arrayList={toList(products)}
            multiEnable={false}
            errorText=""
            selectedArrayList={getSelectedProductOnList()}
            onSelection={handleProductSelect}
          />
          <TouchableOpacity onPress={handleProductSelectBarcodePress}>
            <BarCodeScanIcon />
          </TouchableOpacity>
        </SelectProductContainer>
        <TextInput
          mode="outlined"
          label="Name"
          placeholder="Ex.: Cake for party"
          value={name}
          onChangeText={(text) => setName(text)}
          style={{ width: "100%" }}
        />
        <HelperText visible type="info" padding="none">
          You can choose a different name to this product on the pantry.
        </HelperText>
        <TextInput
          mode="outlined"
          label="Quantity"
          placeholder="Ex.: 3"
          value={`${quantity}`}
          onChangeText={(text) => setQuantity(text as unknown as number)}
          keyboardType="numeric"
          style={{ width: "100%" }}
        />
        <HelperText visible type="info" padding="none">
          Set the product quantity to store
        </HelperText>
        <DatePickerInput
          locale="enGB"
          label="Stored at"
          value={storedAt}
          onChange={(d) => setStoredAt(d ?? new Date())}
          inputMode="start"
        />
        <HelperText visible type="info" padding="none">
          The date when the product was stored in the pantry.
        </HelperText>
        <DatePickerInput
          locale="enGB"
          label="Best before"
          value={bestBefore}
          onChange={(d) => setBestBefore(d ?? new Date())}
          inputMode="start"
        />
        <HelperText visible type="info" padding="none">
          The date until which the product should be consumed.
        </HelperText>
        <TextInput
          mode="outlined"
          label="Bought Price"
          placeholder="Ex.: 10"
          value={`${boughtPrice}`}
          onChangeText={(text) => setBoughtPrice(text as unknown as number)}
          keyboardType="numeric"
          style={{ width: "100%" }}
        />
        <HelperText visible type="info" padding="none">
          Set the price of the product when you bought it.
        </HelperText>
        <TextInput
          mode="outlined"
          label="Prepared"
          placeholder="Ex.: 10"
          value={`${prepared}`}
          onChangeText={(text) => setPrepared(text as unknown as number)}
          keyboardType="numeric"
          style={{ width: "100%" }}
        />
        <HelperText visible type="info" padding="none">
          The quantity of the item that is prepared.
        </HelperText>

        <TextInput
          mode="outlined"
          label="Eaten"
          placeholder="Ex.: 10"
          value={`${eaten}`}
          onChangeText={(text) => setEaten(text as unknown as number)}
          keyboardType="numeric"
          style={{ width: "100%" }}
        />
        <HelperText visible type="info" padding="none">
          The quantity of the item that is eaten.
        </HelperText>

        <TextInput
          mode="outlined"
          label="Expired"
          placeholder="Ex.: 10"
          value={`${expired}`}
          onChangeText={(text) => setExpired(text as unknown as number)}
          keyboardType="numeric"
          style={{ width: "100%" }}
        />
        <HelperText visible type="info" padding="none">
          The quantity of the item that is expired.
        </HelperText>

        <TextInput
          mode="outlined"
          label="Discarded"
          placeholder="Ex.: 10"
          value={`${discarded}`}
          onChangeText={(text) => setDiscarded(text as unknown as number)}
          keyboardType="numeric"
          style={{ width: "100%" }}
        />
        <HelperText visible type="info" padding="none">
          The quantity of the item that is discarded.
        </HelperText>
        <Button
          mode="contained"
          onPress={handleStore}
          disabled={!selectedPantry || (name.length < 1 && !selectedProduct)}
        >
          {!selectedPantry
            ? "Please select a pantry"
            : name.length < 1 && !selectedProduct
            ? "Please select a product or type a name"
            : "save"}
        </Button>
      </ScrollView>
    </View>
  );
}
