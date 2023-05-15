import { Text, View } from "react-native";
import React, { useContext, useState } from "react";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { Button, HelperText, TextInput } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Product from "../classes/product.class";
import { BarCodeScannerContext } from "../../../services/barCodeScanner/barCodeScanner.context";
import { BarCodeScanScreenRouteName } from "../../../infrastructure/navigation/route-names";
import { DependencyInjectionContext } from "../../../services/dependencyInjection/dependency-injection.context";

export type EditProductScreenParams = {
  EditProduct: {
    product: Product; // todo prevent unauthorized edition on switching accounts in this screen.
  };
};
type Props = RouteProp<EditProductScreenParams, "EditProduct">;

export function EditProductScreen({
  route: {
    params: { product },
  },
}: {
  route: Props;
}) {
  const { productService, navigationService, snackBarService } = useContext(
    DependencyInjectionContext
  );

  const [name, setName] = useState(product.name);
  const [measureUnit, setMeasureUnit] = useState(product.measureUnit);
  const [barCode, setBarcode] = useState(product.barCode);
  const [packageWeight, setPackageWeight] = useState(product.packageWeight);

  const handleSave = () => {
    const updatedProduct = product.clone({
      name,
      measureUnit,
      barCode,
      packageWeight,
    });

    // console.log("saving", product, updatedProduct);

    productService.saveProduct(updatedProduct, () => {
      navigationService.showProductsScreen();
      snackBarService.showProductSavedInfo(updatedProduct);
    });
  };

  // todo fix this
  const navigation = useNavigation();
  const { setOnBarCodeScannedCallback } = useContext(BarCodeScannerContext);

  const onBarCodeScanned = (scannedBarCode: string) => {
    setBarcode(scannedBarCode);
    // the previous route should be personalized, as
    navigation.goBack();
  };

  const barcodeButtonCallback = () => {
    setOnBarCodeScannedCallback(onBarCodeScanned);
    navigation.navigate(BarCodeScanScreenRouteName as never);
  };
  // todo ----

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
      <Button mode="contained" onPress={handleSave}>
        Save
      </Button>
      <Text>{`Owner UID: ${product?.ownerUid}`}</Text>
    </View>
  );
}
