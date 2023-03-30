import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { Camera } from "expo-camera";
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import { useActions } from "../../../hooks/useActions";
import OpenFoodFacts from "../../../services/productDataProvider/OpenFoodFacts";
import { IProduct } from "../interfaces/product.interface";

function BarCodeScanScreen() {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const { saveProduct, showErrorSnack } = useActions();
  const isFocused = useIsFocused();
  useFocusEffect(() => {
    setScanned(false);
  });

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignorer
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const handleOnBarCodeScanned = ({ data }: { data: string }) => {
    if (!scanned) {
      setScanned(true);
      (() => {
        new OpenFoodFacts().getProductByBarCode(
          data,
          (product: IProduct) => {
            saveProduct(product);
          },
          () => {
            showErrorSnack(
              // eslint-disable-next-line comma-dangle
              `Couldn't find a product with the barcode '${data}'`
            );
            // eslint-disable-next-line comma-dangle
          }
        );
      })();
      navigation.goBack();
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    camera: {
      flex: 1,
    },
    buttonContainer: {
      flex: 1,
      backgroundColor: "transparent",
      flexDirection: "row",
      margin: 20,
    },
    button: {
      flex: 0.1,
      alignSelf: "flex-end",
      alignItems: "center",
    },
    text: {
      fontSize: 18,
      color: "white",
    },
  });

  return (
    <View style={styles.container}>
      {isFocused && (
        <Camera onBarCodeScanned={handleOnBarCodeScanned} style={{ flex: 1 }} />
      )}
    </View>
  );
}

export default BarCodeScanScreen;
