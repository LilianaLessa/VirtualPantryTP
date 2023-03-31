import React, { createContext } from "react";

type BarCodeScannerContextType = {
  setOnBarCodeScannedCallback: (callback: (barCode: string) => void) => void;
  onBarCodeScanned: (barCode: string) => void;
};

export const BarCodeScannerContext = createContext<BarCodeScannerContextType>({
  setOnBarCodeScannedCallback: (callback: (barCode: string) => void) => {},
  onBarCodeScanned: (callback: (barCode: string) => void) => {},
});

export function BarCodeScannerContextProvider({
  children,
}: {
  children: React.ReactNode[] | React.ReactNode;
}) {
  const defaultOnBarCodeScanned = (barCode: string) => {};
  let onBarCodeScannedCallback = defaultOnBarCodeScanned;

  const setOnBarCodeScannedCallback = (callback: (barCode: string) => void) => {
    onBarCodeScannedCallback = callback;
  };
  const onBarCodeScanned = (barCode: string) => {
    onBarCodeScannedCallback(barCode);
    onBarCodeScannedCallback = defaultOnBarCodeScanned;
  };

  return (
    <BarCodeScannerContext.Provider
      value={{
        setOnBarCodeScannedCallback,
        onBarCodeScanned,
      }}
    >
      {children}
    </BarCodeScannerContext.Provider>
  );
}
