import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import GroupService from "../../features/group/services/group.service";
import { AuthenticationContext } from "../firebase/authentication.context";
import AuthGuardService from "../firebase/auth-guard.service";
import NavigationService from "../../infrastructure/navigation/services/navigation.service";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { useActions } from "../../hooks/useActions";
import SnackBarService from "../information/snack-bar.service";
import { FirestoreContext } from "../firebase/firestore.context";
import ProductService from "../../features/products/services/product.service";
import BarCodeScanService from "../barCodeScanner/bar-code-scan.service";

type DependencyInjectionContextType = {
  authGuardService: AuthGuardService;
  groupService: GroupService;
  navigationService: NavigationService;
  snackBarService: SnackBarService;
  productService: ProductService;
  barCodeScanService: BarCodeScanService;
};

const defaultValue = {
  authGuardService: new AuthGuardService(null),
  groupService: new GroupService(new AuthGuardService(null)),
  navigationService: new NavigationService(),
  snackBarService: new SnackBarService(),
  productService: new ProductService([], new AuthGuardService(null), {}),
  barCodeScanService: new BarCodeScanService(new NavigationService()),
};

export const DependencyInjectionContext =
  createContext<DependencyInjectionContextType>(defaultValue);

export function DependencyInjectionContextProvider({
  children,
}: {
  children: React.ReactNode[] | React.ReactNode;
}) {
  const stateActions = useActions();
  const firestoreContext = useContext(FirestoreContext);
  const { user } = useContext(AuthenticationContext);
  const navigation = useNavigation();
  const { groups } = useTypedSelector((state) => state.groups);
  const { savedProducts } = useTypedSelector((state) => state.savedProducts);

  const [authGuardService, setAuthGuardService] = useState(
    defaultValue.authGuardService
  );
  const [groupService, setGroupService] = useState(defaultValue.groupService);
  const [navigationService, setNavigationService] = useState(
    defaultValue.navigationService
  );

  const [snackBarService] = useState(new SnackBarService(stateActions));
  const [barCodeScanService, setBarCodeScanService] = useState(
    new BarCodeScanService(navigationService)
  );

  const [productService, setProductService] = useState(
    new ProductService(
      Array.from(savedProducts.values()),
      authGuardService,
      stateActions
    )
  );

  useEffect(() => {
    setAuthGuardService(new AuthGuardService(user));

    // init group collection.
  }, [user]);

  useEffect(() => {
    // console.log("instantiating group service", groups);
    setGroupService(
      new GroupService(authGuardService, groups, stateActions, firestoreContext)
    );
  }, [authGuardService, groups]);

  useEffect(() => {
    // console.log("init product service", Array.from(savedProducts.values()));
    setProductService(
      new ProductService(
        Array.from(savedProducts.values()),
        authGuardService,
        stateActions
      )
    );
  }, [authGuardService, savedProducts]);

  useEffect(() => {
    setNavigationService(new NavigationService(navigation));
  }, [navigation]);

  useEffect(() => {
    setBarCodeScanService(new BarCodeScanService(navigationService));
  }, [navigationService]);

  return (
    <DependencyInjectionContext.Provider
      value={{
        authGuardService,
        groupService,
        navigationService,
        snackBarService,
        productService,
        barCodeScanService,
      }}
    >
      {children}
    </DependencyInjectionContext.Provider>
  );
}
