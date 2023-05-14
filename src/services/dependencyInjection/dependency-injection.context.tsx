import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import GroupService from "../../features/group/services/group.service";
import { AuthenticationContext } from "../firebase/authentication.context";
import AuthGuardService from "../firebase/auth-guard.service";
import NavigationService from "../../infrastructure/navigation/services/navigation.service";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { useActions } from "../../hooks/useActions";
import SnackBarService from "../information/snack-bar.service";

type DependencyInjectionContextType = {
  authGuardService: AuthGuardService;
  groupService: GroupService;
  navigationService: NavigationService;
  snackBarService: SnackBarService;
};

const defaultValue = {
  authGuardService: new AuthGuardService(null),
  groupService: new GroupService(new AuthGuardService(null)),
  navigationService: new NavigationService(),
  snackBarService: new SnackBarService(),
};

export const DependencyInjectionContext =
  createContext<DependencyInjectionContextType>(defaultValue);

export function DependencyInjectionContextProvider({
  children,
}: {
  children: React.ReactNode[] | React.ReactNode;
}) {
  const stateActions = useActions();
  const { user } = useContext(AuthenticationContext);
  const navigation = useNavigation();
  const { groups } = useTypedSelector((state) => state.groups);

  const [authGuardService, setAuthGuardService] = useState(
    defaultValue.authGuardService
  );
  const [groupService, setGroupService] = useState(defaultValue.groupService);
  const [navigationService, setNavigationService] = useState(
    defaultValue.navigationService
  );

  const [snackBarService] = useState(new SnackBarService(stateActions));

  useEffect(() => {
    setAuthGuardService(new AuthGuardService(user));

    // init group collection.
  }, [user]);

  useEffect(() => {
    // console.log("instantiating group service", groups);
    setGroupService(new GroupService(authGuardService, groups, stateActions));
  }, [authGuardService, groups]);

  useEffect(() => {
    setNavigationService(new NavigationService(navigation));
  }, [navigation]);

  return (
    <DependencyInjectionContext.Provider
      value={{
        authGuardService,
        groupService,
        navigationService,
        snackBarService,
      }}
    >
      {children}
    </DependencyInjectionContext.Provider>
  );
}
