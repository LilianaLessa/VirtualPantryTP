import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { Camera } from "expo-camera";
import {
  RouteProp,
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";

export const BarCodeScanScreenRouteName = "BarCodeScanScreen";
export type BarCodeScanScreenParams = {
  BarCodeScanScreen: {
    onBarCodeScanned?: (barCode: string) => void;
    isEdit?: boolean;
  };
};
type Props = RouteProp<BarCodeScanScreenParams, "BarCodeScanScreen">;

function BarCodeScanScreen({ route }: { route: Props }) {
  const { onBarCodeScanned } = route.params ?? {};

  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

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
      if (typeof onBarCodeScanned !== "undefined") {
        onBarCodeScanned(data);
      }
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
