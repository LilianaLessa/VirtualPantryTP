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
import PantryService from "../../features/pantries/services/pantry.service";
import ShoppingListService from "../../features/shoppingList/services/shopping-list.service";
import DataSynchronizerService from "../applicationData/data-synchronizer.service";
import NotificationService from "../../features/notification/services/notification.service";
import ConfigurationService from "../../features/configuration/services/configuration.service";

type DependencyInjectionContextType = {
  authGuardService: AuthGuardService;
  groupService: GroupService;
  navigationService: NavigationService;
  snackBarService: SnackBarService;
  productService: ProductService;
  barCodeScanService: BarCodeScanService;
  pantryService: PantryService;
  shoppingListService: ShoppingListService;
  notificationService: NotificationService;
  configurationService: ConfigurationService;
};

const defaultValue = {
  authGuardService: new AuthGuardService(null),
  groupService: new GroupService(null, new AuthGuardService(null)),
  navigationService: new NavigationService(),
  snackBarService: new SnackBarService(),
  productService: new ProductService([], new AuthGuardService(null), {}, {}),
  barCodeScanService: new BarCodeScanService(new NavigationService()),
  pantryService: new PantryService(
    [],
    [],
    new AuthGuardService(null),
    null,
    new ConfigurationService(
      new DataSynchronizerService(new AuthGuardService(null), null, null),
      null
    ),
    {},
    {}
  ),
  shoppingListService: new ShoppingListService(
    [],
    [],
    new AuthGuardService(null),
    {},
    {}
  ),
  notificationService: new NotificationService([], null, {}),
  configurationService: new ConfigurationService(
    new DataSynchronizerService(new AuthGuardService(null), null, null),
    null
  ),
};

// todo this shouldn't depend that much on useEffect.
//  Better would be to load all the application dependencies via promises, then load the services.
export const DependencyInjectionContext =
  createContext<DependencyInjectionContextType>(defaultValue);

export function DependencyInjectionContextProvider({
  children,
}: {
  children: React.ReactNode[] | React.ReactNode;
}) {
  const stateActions = useActions();
  const firestoreActions = useContext(FirestoreContext);
  const { user } = useContext(AuthenticationContext);
  const navigation = useNavigation();
  const { groups } = useTypedSelector((state) => state.groups);
  const { savedProducts } = useTypedSelector((state) => state.savedProducts);
  const { notifications } = useTypedSelector((state) => state.notifications);
  const { storedProducts } = useTypedSelector((state) => state.storedProducts);
  const { pantries } = useTypedSelector((state) => state.pantries);
  const { shoppingLists, shoppingListItems } = useTypedSelector(
    (state) => state.shoppingLists
  );
  const { configuration } = useTypedSelector((state) => state.configuration);

  const [authGuardService, setAuthGuardService] = useState(
    defaultValue.authGuardService
  );
  const [groupService, setGroupService] = useState(defaultValue.groupService);
  const [navigationService, setNavigationService] = useState(
    defaultValue.navigationService
  );

  const [snackBarService] = useState(new SnackBarService(stateActions));
  const [barCodeScanService, setBarCodeScanService] = useState(
    defaultValue.barCodeScanService
  );

  const [pantryService, setPantryService] = useState(
    defaultValue.pantryService
  );

  const [productService, setProductService] = useState(
    defaultValue.productService
  );

  const [shoppingListService, setShoppingListService] = useState(
    defaultValue.shoppingListService
  );

  const [dataSynchronizerService, setDataSynchronizerService] = useState(
    new DataSynchronizerService(
      authGuardService,
      stateActions,
      firestoreActions
    )
  );

  const [notificationService, setNotificationService] = useState(
    defaultValue.notificationService
  );

  const [configurationService, setConfigurationService] = useState(
    defaultValue.configurationService
  );

  useEffect(() => {
    setConfigurationService(
      new ConfigurationService(
        dataSynchronizerService,
        stateActions,
        configuration
      )
    );
  }, [dataSynchronizerService, configuration]);

  useEffect(() => {
    setDataSynchronizerService(
      new DataSynchronizerService(
        authGuardService,
        stateActions,
        firestoreActions
      )
    );
  }, [authGuardService, firestoreActions]);

  useEffect(() => {
    setNotificationService(
      new NotificationService(
        Array.from(notifications.values()),
        dataSynchronizerService,
        stateActions
      )
    );
  }, [dataSynchronizerService, notifications]);

  useEffect(() => {
    setAuthGuardService(new AuthGuardService(user));

    // init group collection.
  }, [user]);

  useEffect(() => {
    // console.log("init product service", Array.from(savedProducts.values()));
    setProductService(
      new ProductService(
        Array.from(savedProducts.values()),
        authGuardService,
        stateActions,
        firestoreActions
      )
    );
  }, [authGuardService, savedProducts, firestoreActions]);

  useEffect(() => {
    // console.log(Array.from(storedProducts.values()));
    pantryService.destructor();
    setPantryService(
      new PantryService(
        Array.from(pantries.values()),
        Array.from(storedProducts.values()),
        authGuardService,
        notificationService,
        configurationService,
        stateActions,
        firestoreActions
      )
    );
  }, [
    notificationService,
    configurationService,
    authGuardService,
    pantries,
    storedProducts,
    firestoreActions,
  ]);

  useEffect(() => {
    setShoppingListService(
      new ShoppingListService(
        Array.from(shoppingLists.values()),
        Array.from(shoppingListItems.values()),
        authGuardService,
        stateActions,
        firestoreActions
      )
    );
  }, [shoppingLists, shoppingListItems, authGuardService, firestoreActions]);

  useEffect(() => {
    setNavigationService(new NavigationService(navigation));
  }, [navigation]);

  useEffect(() => {
    setBarCodeScanService(new BarCodeScanService(navigationService));
  }, [navigationService]);

  useEffect(() => {
    groupService.destructor();
    setGroupService(
      new GroupService(
        notificationService,
        authGuardService,
        groups,
        stateActions,
        firestoreActions
      )
    );
  }, [authGuardService]);

  useEffect(() => {
    console.log("groupservice: Updating groups");
    groupService.groups = groups;
  }, [groups]);

  useEffect(() => {
    groupService.notificationService = notificationService;
  }, [notificationService]);

  return (
    <DependencyInjectionContext.Provider
      value={{
        authGuardService,
        groupService,
        navigationService,
        snackBarService,
        productService,
        barCodeScanService,
        pantryService,
        shoppingListService,
        notificationService,
        configurationService,
      }}
    >
      {children}
    </DependencyInjectionContext.Provider>
  );
}
