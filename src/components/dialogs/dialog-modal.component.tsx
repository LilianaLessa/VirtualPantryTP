import React, { useContext } from "react";
import { Modal } from "react-native-paper";
import { DialogModalContext } from "../../services/modal/dialog-modal.context";

function DialogModal() {
  const { modalVisible, modalContent } = useContext(DialogModalContext);

  return <Modal visible={modalVisible}>{modalContent}</Modal>;
}

export default DialogModal;
