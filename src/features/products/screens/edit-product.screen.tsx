import { TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { v4 as uuidv4 } from "uuid";
import { Button, HelperText, TextInput } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { IProduct } from "../interfaces/product.interface";
import { useActions } from "../../../hooks/useActions";
import Product from "../classes/product";
import { BarCodeScanScreenRouteName } from "./barcode-scan.screen";

export const EditProductScreenRouteName = "EditProduct";
export type EditProductScreenParams = {
  EditProduct: {
    product?: IProduct;
    isEdit?: boolean;
  };
};
type Props = RouteProp<EditProductScreenParams, "EditProduct">;

export function EditProductScreen({ route }: { route: Props }) {
  let { product } = route.params ?? {};
  const { isEdit } = route.params ?? { isEdit: false };
  const navigation = useNavigation();
  console.log("edit", isEdit, product);
  const screenTitle = isEdit ? "Edit product" : "Create Product";
  navigation.setOptions({
    title: screenTitle,
  });

  const [name, setName] = useState(product?.name ?? "");
  const [measureUnit, setMeasureUnit] = useState(product?.measureUnit ?? "");
  const [barCode, setBarcode] = useState(product?.barCode ?? "");
  const [packageWeight, setPackageWeight] = useState(
    product?.packageWeight ?? 1
  );
  const { saveProduct } = useActions();

  const handleProductSave = () => {
    product = product ?? new Product(uuidv4());
    product.name = name;
    product.measureUnit = measureUnit;
    product.packageWeight = packageWeight;
    product.barCode = barCode;

    saveProduct(product);
    navigation.goBack();
  };

  const onBarCodeScanned = (barCode: string) => {
    setBarcode(barCode);
  };

  const barcodeButtonCallback = () => {
    navigation.navigate(
      BarCodeScanScreenRouteName as never,
      {
        onBarCodeScanned,
      } as never
    );
  };

  return (
    <View>
      <TextInput
        mode="outlined"
        label="Product name"
        placeholder="Ex.: My Product"
        value={name}
        onChangeText={(text) => setName(text)}
        style={{ width: "100%" }}
      />
      <HelperText visible type="info" padding="none">
        Type a name for your product
      </HelperText>
      <TextInput
        mode="outlined"
        label="Measure unit"
        placeholder="Ex.: Kilo"
        value={measureUnit}
        onChangeText={(text) => setMeasureUnit(text)}
        style={{ width: "100%" }}
      />
      <HelperText visible type="info" padding="none">
        Type the measure unit for your product
      </HelperText>
      <TextInput
        mode="outlined"
        label="Package Weight (Grams)"
        placeholder="Ex.: 100"
        value={packageWeight.toString()}
        keyboardType="numeric"
        onChangeText={(grams) => setPackageWeight(grams as unknown as number)}
        style={{ width: "100%" }}
      />
      <HelperText visible type="info" padding="none">
        Type the quantity of product in the package, in grams
      </HelperText>
      <View />
      <TextInput
        mode="outlined"
        label="Bar code"
        placeholder="Ex.: 123456789"
        value={barCode}
        keyboardType="numeric"
        onChangeText={(text) => setBarcode(text)}
        style={{ width: "100%" }}
        right={
          <TextInput.Icon
            icon={() => (
              <MaterialCommunityIcons
                name="barcode-scan"
                style={{ fontSize: 20 }}
              />
            )}
            onPress={barcodeButtonCallback}
          />
        }
      />
      <HelperText visible type="info" padding="none">
        Type or scan the bar code for the product
      </HelperText>
      <Button mode="contained" onPress={handleProductSave}>
        Save
      </Button>
    </View>
  );
}
