// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { createContext, useEffect, useState } from "react";
import { FirebaseApp, initializeApp } from "firebase/app";
import {
  FIREBASE_API_KEY,
  FIREBASE_APP_ID,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
} from "react-native-dotenv";

function initializeFirebaseApp() {
  const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
    appId: FIREBASE_APP_ID,
  };

  return initializeApp(firebaseConfig);
}

type FirebaseContextType = {
  firebaseApp?: FirebaseApp;
};

export const FirebaseContext = createContext<FirebaseContextType>({});

export function FirebaseContextProvider({
  children,
}: {
  children: React.ReactNode[] | React.ReactNode;
}) {
  const [firebaseApp, setFirebaseApp] = useState<FirebaseApp>();

  useEffect(() => {
    setFirebaseApp(initializeFirebaseApp());
  }, []);

  return (
    <FirebaseContext.Provider
      value={{
        firebaseApp,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}
