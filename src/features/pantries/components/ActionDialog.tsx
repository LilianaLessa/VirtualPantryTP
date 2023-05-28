import { TextInput } from "react-native-paper";
import { TouchableOpacity } from "react-native";
import React, { useContext, useState } from "react";
import {
  DialogBoxContainer,
  DialogButtonsContainer,
  DialogCancelButtonLabel,
  DialogContent,
  DialogContentContainer,
  DialogTitle,
  DialogTitleContainer,
} from "../../../components/dialogs/confirm-dialog.styles";
import { DialogModalContext } from "../../../services/modal/dialog-modal.context";

export default function ActionDialog({
  Icon,
  title,
  saveHandler,
}: {
  Icon: any;
  title: string;
  saveHandler: (quantity: number) => void;
}) {
  const { hideModal } = useContext(DialogModalContext);

  const [quantity, setQuantity] = useState(0);

  const handleSave = () => {
    hideModal();
    saveHandler(quantity);
  };

  return (
    <DialogBoxContainer>
      <DialogTitleContainer>
        <DialogTitle>
          <Icon />
          {title}
        </DialogTitle>
      </DialogTitleContainer>
      <DialogContentContainer>
        <DialogContent>
          <TextInput
            placeholder="Quantity"
            keyboardType="numeric"
            onChangeText={(text) => {
              setQuantity(Number(text));
            }}
            onSubmitEditing={handleSave}
            value={quantity.toString()}
          />
        </DialogContent>
      </DialogContentContainer>
      <DialogButtonsContainer>
        <TouchableOpacity onPress={handleSave}>
          <DialogCancelButtonLabel>Save</DialogCancelButtonLabel>
        </TouchableOpacity>
        <TouchableOpacity onPress={hideModal}>
          <DialogCancelButtonLabel>Cancel</DialogCancelButtonLabel>
        </TouchableOpacity>
      </DialogButtonsContainer>
    </DialogBoxContainer>
  );
}
