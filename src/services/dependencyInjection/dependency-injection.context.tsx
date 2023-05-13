import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import GroupService from "../../features/group/services/group.service";
import { AuthenticationContext } from "../firebase/authentication.context";
import AuthGuardService from "../firebase/auth-guard.service";
import NavigationService from "../../infrastructure/navigation/services/navigation.service";

type DependencyInjectionContextType = {
  authGuardService: AuthGuardService;
  groupService: GroupService;
  navigationService: NavigationService;
};

const defaultValue = {
  authGuardService: new AuthGuardService(null),
  groupService: new GroupService(new AuthGuardService(null)),
  navigationService: new NavigationService(),
};

export const DependencyInjectionContext =
  createContext<DependencyInjectionContextType>(defaultValue);

export function DependencyInjectionContextProvider({
  children,
}: {
  children: React.ReactNode[] | React.ReactNode;
}) {
  const { user } = useContext(AuthenticationContext);
  const navigation = useNavigation();

  const [authGuardService, setAuthGuardService] = useState(
    defaultValue.authGuardService
  );
  const [groupService, setGroupService] = useState(defaultValue.groupService);
  const [navigationService, setNavigationService] = useState(
    defaultValue.navigationService
  );

  useEffect(() => {
    setAuthGuardService(new AuthGuardService(user));
  }, [user]);

  useEffect(() => {
    setGroupService(new GroupService(authGuardService));
  }, [authGuardService]);

  useEffect(() => {
    setNavigationService(new NavigationService(navigation));
  }, [navigation]);

  return (
    <DependencyInjectionContext.Provider
      value={{
        authGuardService,
        groupService,
        navigationService,
      }}
    >
      {children}
    </DependencyInjectionContext.Provider>
  );
}
