import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";

import { Camera } from "expo-camera";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import Product from "../classes/product.class";
import { useActions } from "../../../hooks/useActions";

const searchProductByBarCode = async (barcode: string, saveProduct) => {
  axios
    .get(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`)
    .then((response) => {
      const { data } = response;
      try {
        const { code, product, status_verbose } = data;
        const { product_name } = product;

        saveProduct(new Product(uuidv4(), product_name));

        console.log(code, product_name, status_verbose, "success response");
      } catch (e) {
        console.log(data, "exception on response");
      }
    })
    .catch((error) => {
      console.log(error, "error response");
    });
};

function BarCodeScanScreen() {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const { saveProduct } = useActions();
  const isFocused = useIsFocused();
  useFocusEffect(() => {
    setScanned(false);
  });

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

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
        <Camera
          onBarCodeScanned={({ data }: { data: string }) => {
            if (!scanned) {
              console.log("Barcode Scanned:", data);
              searchProductByBarCode(data, saveProduct);
              setScanned(true);
              navigation.goBack();
            }
          }}
          style={{ flex: 1 }}
        />
      )}
    </View>
  );
}

export default BarCodeScanScreen;
