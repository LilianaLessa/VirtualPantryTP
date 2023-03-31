import React from "react";
import { Snackbar } from "react-native-paper";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { useActions } from "../hooks/useActions";

function InfoSnackbar() {
  const { infoVisible, infoMessage } = useTypedSelector(
    // eslint-disable-next-line comma-dangle
    (state) => state.messageSnackbar
  );
  const { hideInfoSnack } = useActions();

  return (
    <Snackbar
      visible={infoVisible}
      onDismiss={() => hideInfoSnack()}
      action={{
        label: "Dismiss",
        onPress: () => hideInfoSnack(),
      }}
      duration={3000}
    >
      {infoMessage}
    </Snackbar>
  );
}

export default InfoSnackbar;
