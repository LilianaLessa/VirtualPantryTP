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
import { DialogModalContextProvider } from "../../services/modal/dialog-modal.context";
import DialogModal from "../../components/dialogs/dialog-modal.component";
import { ProductSearchContextProvider } from "../../services/productSearch/product-search.context";

function Navigation() {
  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <Provider store={store}>
          <BarCodeScannerContextProvider>
            <DialogModalContextProvider>
              <ProductSearchContextProvider>
                <AppNavigator />
                <DialogModal />
                <LoadingModal />
                <ErrorSnackbar />
                <InfoSnackbar />
              </ProductSearchContextProvider>
            </DialogModalContextProvider>
          </BarCodeScannerContextProvider>
        </Provider>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}

export default Navigation;
