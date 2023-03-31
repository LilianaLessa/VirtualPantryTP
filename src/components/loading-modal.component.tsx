import React from "react";
import { ActivityIndicator, MD2Colors } from "react-native-paper";
import Modal from "react-native-modal";
import { useTypedSelector } from "../hooks/useTypedSelector";

function LoadingModal() {
  const { fetchingData } = useTypedSelector((state) => state.apiActivity);
  return (
    <Modal isVisible={fetchingData}>
      <ActivityIndicator animating color={MD2Colors.red800} size="large" />
    </Modal>
  );
}

export default LoadingModal;
