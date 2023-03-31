import { TouchableOpacity } from "react-native";
import React from "react";
import {
  DialogBoxContainer,
  DialogButtonsContainer,
  DialogCancelButtonLabel,
  DialogConfirmButtonLabel,
  DialogContent,
  DialogContentContainer,
  DialogTitle,
  DialogTitleContainer,
} from "./confirm-dialog.styles";

function ConfirmDialog({
  confirmHandler,
  cancelHandler,
  dialogTitle,
  dialogContent,
  confirm,
  cancel,
}: {
  confirmHandler: () => void;
  cancelHandler: () => void;
  dialogTitle?: string;
  dialogContent?: string;
  confirm?: string;
  cancel?: string;
}) {
  return (
    <DialogBoxContainer>
      <DialogTitleContainer>
        <DialogTitle>{dialogTitle || "Dialog Title"}</DialogTitle>
      </DialogTitleContainer>
      <DialogContentContainer>
        <DialogContent>{dialogContent || "Dialog Content"}</DialogContent>
      </DialogContentContainer>
      <DialogButtonsContainer>
        <TouchableOpacity onPress={confirmHandler}>
          <DialogConfirmButtonLabel>
            {confirm || "Confirm"}
          </DialogConfirmButtonLabel>
        </TouchableOpacity>
        <TouchableOpacity onPress={cancelHandler}>
          <DialogCancelButtonLabel>
            {cancel || "Cancel"}
          </DialogCancelButtonLabel>
        </TouchableOpacity>
      </DialogButtonsContainer>
    </DialogBoxContainer>
  );
}

ConfirmDialog.defaultProps = {
  dialogTitle: "Dialog Title",
  dialogContent: "Dialog Content",
  confirm: "Confirm",
  cancel: "Cancel",
};

export default ConfirmDialog;
