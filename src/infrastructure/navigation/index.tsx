import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as ReduxProvider } from "react-redux";
import { Provider as PaperProvider } from "react-native-paper";
import AppNavigator from "./app.navigator";
import { store } from "../../state";
import LoadingModal from "../../components/loading-modal.component";
import ErrorSnackbar from "../../components/error-snackbar.component";
import InfoSnackbar from "../../components/info-snackbar.component";
import { BarCodeScannerContextProvider } from "../../services/barCodeScanner/barCodeScanner.context";
import { DialogModalContextProvider } from "../../services/modal/dialog-modal.context";
import DialogModal from "../../components/dialogs/dialog-modal.component";
import { ProductSearchContextProvider } from "../../services/productSearch/product-search.context";
import { ApplicationDataContextProvider } from "../../services/applicationData/application-data.context";
import { FirebaseContextProvider } from "../../services/firebase/firebase.context";
import { AuthenticationContextProvider } from "../../services/firebase/authentication.context";
import { FirestoreContextProvider } from "../../services/firebase/firestore.context";
import { DependencyInjectionContextProvider } from "../../services/dependencyInjection/dependency-injection.context";

// todo PaperProvider also needs a theme. check how it works with ThemeProvider.
function Navigation() {
  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <ReduxProvider store={store}>
          <FirebaseContextProvider>
            <AuthenticationContextProvider>
              <FirestoreContextProvider>
                <ApplicationDataContextProvider>
                  <DependencyInjectionContextProvider>
                    <BarCodeScannerContextProvider>
                      <DialogModalContextProvider>
                        <ProductSearchContextProvider>
                          <PaperProvider>
                            <AppNavigator />
                            <DialogModal />
                            <LoadingModal />
                            <ErrorSnackbar />
                            <InfoSnackbar />
                          </PaperProvider>
                        </ProductSearchContextProvider>
                      </DialogModalContextProvider>
                    </BarCodeScannerContextProvider>
                  </DependencyInjectionContextProvider>
                </ApplicationDataContextProvider>
              </FirestoreContextProvider>
            </AuthenticationContextProvider>
          </FirebaseContextProvider>
        </ReduxProvider>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}

export default Navigation;
