import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import AppNavigator from "./app.navigator";
import { store } from "../../state";
import LoadingModal from "../../components/loading-modal.component";
import ErrorSnackbar from "../../components/error-snackbar.component";
import InfoSnackbar from "../../components/info-snackbar.component";
import { BarCodeScannerContextProvider } from "../../services/barCodeScanner/barCodeScanner.context";

function Navigation() {
  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <Provider store={store}>
          <BarCodeScannerContextProvider>
            <AppNavigator />
            <LoadingModal />
            <ErrorSnackbar />
            <InfoSnackbar />
          </BarCodeScannerContextProvider>
        </Provider>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}

export default Navigation;