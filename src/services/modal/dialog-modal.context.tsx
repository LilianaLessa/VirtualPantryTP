import React, { createContext, useState } from "react";
import { View } from "react-native";

type DialogModalContextType = {
  modalVisible: boolean;
  modalContent: JSX.Element;
  showModal: (content: JSX.Element) => void;
  hideModal: () => void;
};

const defaultModalContent = <View />;
export const DialogModalContext = createContext<DialogModalContextType>({
  modalVisible: false,
  modalContent: defaultModalContent,
  showModal: (content: JSX.Element) => {},
  hideModal: () => {},
});

export function DialogModalContextProvider({
  children,
}: {
  children: React.ReactNode[];
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(defaultModalContent);

  const showModal = (content: JSX.Element) => {
    console.log(content);
    setModalContent(content);
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
    setModalContent(defaultModalContent);
  };

  return (
    <DialogModalContext.Provider
      value={{
        modalVisible,
        modalContent,
        showModal,
        hideModal,
      }}
    >
      {children}
    </DialogModalContext.Provider>
  );
}
