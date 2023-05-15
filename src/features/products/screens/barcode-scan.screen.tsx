import { View, Text, Vibration } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Camera } from "expo-camera";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { DependencyInjectionContext } from "../../../services/dependencyInjection/dependency-injection.context";

function BarCodeScanScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const { barCodeScanService, navigationService } = useContext(
    DependencyInjectionContext
  );

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
      // todo eventually, vibration could be a service and, therefore, configurable
      Vibration.vibrate(75);
      navigationService.goBack();
      barCodeScanService.onScan(data);
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
