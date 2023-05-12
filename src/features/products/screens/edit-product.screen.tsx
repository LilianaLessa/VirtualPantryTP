import { Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { RouteProp, useNavigation } from "@react-navigation/native";
// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 as uuidv4 } from "uuid";
import { Button, HelperText, TextInput } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { IProduct } from "../interfaces/product.interface";
import { useActions } from "../../../hooks/useActions";
import Product from "../classes/product.class";
import { BarCodeScannerContext } from "../../../services/barCodeScanner/barCodeScanner.context";
import { BarCodeScanScreenRouteName } from "../../../infrastructure/navigation/route-names";
import { FirestoreContext } from "../../../services/firebase/firestore.context";

export type EditProductScreenParams = {
  EditProduct: {
    // todo it's possible to edit another person product if login
    //  on the product edit screen and go back., and the same happens on pantries. fix it.
    product?: IProduct;
    isEdit?: boolean;
    routeToNavigateOnSave?: string | null;
  };
};
type Props = RouteProp<EditProductScreenParams, "EditProduct">;

export function EditProductScreen({ route }: { route: Props }) {
  let { product } = route.params ?? {};
  const { isEdit, routeToNavigateOnSave } = route.params ?? {
    isEdit: false,
    routeToNavigateOnSave: null,
  };
  const navigation = useNavigation();
  const { setOnBarCodeScannedCallback } = useContext(BarCodeScannerContext);

  useEffect(() => {
    const screenTitle = isEdit ? "Edit Product" : "Create Product";
    navigation.setOptions({
      title: screenTitle,
    });
  }, [isEdit, navigation]);
  const [name, setName] = useState(product?.name ?? "");
  const [measureUnit, setMeasureUnit] = useState(product?.measureUnit ?? "");
  const [barCode, setBarcode] = useState(product?.barCode ?? "");
  const [packageWeight, setPackageWeight] = useState(
    product?.packageWeight ?? 1
  );
  const { saveProduct } = useActions();
  const { saveProductOnFirestore } = useContext(FirestoreContext);

  const handleProductSave = () => {
    product = product ?? new Product(uuidv4());
    product.name = name;
    product.measureUnit = measureUnit;
    product.packageWeight = packageWeight;
    product.barCode = barCode;

    saveProduct(product);
    saveProductOnFirestore(product);
    if (typeof routeToNavigateOnSave === "string") {
      navigation.navigate(routeToNavigateOnSave as never);
    } else {
      navigation.goBack();
    }
  };

  const onBarCodeScanned = (scannedBarCode: string) => {
    setBarcode(scannedBarCode);
    // the previous route should be personalized, as
    navigation.goBack();
  };

  const barcodeButtonCallback = () => {
    setOnBarCodeScannedCallback(onBarCodeScanned);
    navigation.navigate(BarCodeScanScreenRouteName as never);
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
      <Text>{`Owner UID: ${product?.ownerUid}`}</Text>
    </View>
  );
}
