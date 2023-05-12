import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  User,
  FirebaseError,
  Auth,
  browserLocalPersistence,
  UserCredential,
  initializeAuth,
  onAuthStateChanged,
  getAuth,
  signOut,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FirebaseContext } from "./firebase.context";

type AuthenticationContextType = {
  user: User | null;
  isAuthenticated: boolean;
  onLogin?: (email: string, password: string) => void;
  onLogout?: () => void;
  error?: FirebaseError | null;
  createAccount?: (
    email: string,
    password: string,
    displayName: string,
    onSuccessCallback: () => void,
    onErrorCallback?: (e: any) => void
  ) => void;
};

export const AuthenticationContext = createContext<AuthenticationContextType>({
  user: null,
  isAuthenticated: false,
});

export function AuthenticationContextProvider({
  children,
}: {
  children: React.ReactNode[] | React.ReactNode;
}) {
  const { firebaseApp } = useContext(FirebaseContext);

  const [user, setUser] = useState<User | null>();
  const [error, setError] = useState<FirebaseError | null>(null);
  const [auth, setAuth] = useState<Auth>();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  AsyncStorage.getItem("@loggedUser").then((result) => {
    const storedUser = result ? JSON.parse(result) : null;
    if (storedUser) {
      setUser(storedUser as User);
    } else {
      setUser(null);
    }
  });

  // console.log(app);
  useEffect(() => {
    if (firebaseApp) {
      let newAuth = getAuth(firebaseApp);
      if (!newAuth) {
        newAuth = initializeAuth(firebaseApp, {
          persistence: browserLocalPersistence,
        });
      }

      setAuth(newAuth);
      onAuthStateChanged(newAuth, (newUser) => {
        if (newUser) {
          AsyncStorage.setItem(
            "@loggedUser",
            JSON.stringify(newUser?.toJSON() ?? null)
          )
            .then(() => {
              setUser(newUser);
              console.log("User is signed in", newUser);
            })
            .catch((e) => {
              console.warn("failed to store user session", e);
            });
        } else {
          // User is signed out
          console.log("User is signed out");
        }
      });
    }
  }, [firebaseApp]);

  function onLogin(email: string, password: string): void {
    setError(null);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential: UserCredential) => {
        setIsAuthenticated(true);
        // setUser(userCredential.user);
        // return userCredential;
      })
      .catch((e) => {
        setIsAuthenticated(false);
        setUser(null);
        setError(e);
        console.log(e);
      });

    // todo the login Request should move to service?
  }

  function onLogout(): void {
    if (auth) {
      signOut(auth)
        .then(() => {
          AsyncStorage.setItem("@loggedUser", JSON.stringify(null))
            .then(() => {
              setUser(null);
            })
            .catch((e) => {
              console.warn("failed to remove stored user session", e);
            });
        })
        .catch((e) => {
          console.log("Error on logging out:", e);
        });
    }
  }

  const createAccount = (
    email: string,
    password: string,
    displayName: string,
    onSuccessCallback: () => void,
    onErrorCallback?: (e: any) => void
  ): void => {
    if (auth) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          onLogin(email, password);
          onSuccessCallback();
        })
        .catch((e) => {
          setError(e);
          if (typeof onErrorCallback !== "undefined") {
            onErrorCallback(e);
          }
        });
    }
  };

  return (
    <AuthenticationContext.Provider
      value={{
        user,
        isAuthenticated,
        onLogin,
        onLogout,
        error,
        createAccount,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}
