import { View, Text, Vibration } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Camera } from "expo-camera";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { BarCodeScannerContext } from "../../../services/barCodeScanner/barCodeScanner.context";

function BarCodeScanScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const { onBarCodeScanned } = useContext(BarCodeScannerContext);

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
      Vibration.vibrate(75);
      onBarCodeScanned(data);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {isFocused && (
        <Camera onBarCodeScanned={handleOnBarCodeScanned} style={{ flex: 1 }} />
      )}
    </View>
  );
}

export default BarCodeScanScreen;
