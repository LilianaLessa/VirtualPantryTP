import React from "react";
import { Snackbar } from "react-native-paper";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { useActions } from "../hooks/useActions";

function ErrorSnackbar() {
  const { errorVisible, errorMessage } = useTypedSelector(
    // eslint-disable-next-line comma-dangle
    (state) => state.messageSnackbar
  );
  const { hideErrorSnack } = useActions();

  return (
    <Snackbar
      style={{
        backgroundColor: "#B22D1D",
      }}
      visible={errorVisible}
      onDismiss={() => hideErrorSnack()}
      action={{
        label: "Dismiss",
        onPress: () => hideErrorSnack(),
      }}
      duration={7000}
    >
      {errorMessage}
    </Snackbar>
  );
}

export default ErrorSnackbar;
