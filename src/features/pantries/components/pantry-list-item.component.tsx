import { TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styled from "styled-components";
import { useNavigation } from "@react-navigation/native";
import { IPantry } from "../interfaces/pantry.interface";
import {
  // todo make these more generic
  AddToPantryIcon,
  DeleteIcon,
  DragHandler,
  EditIcon,
  LeftContent,
  LeftText,
  ProductListItemContainer,
  RightContent,
} from "../../products/components/product-list-item.styles";
import ConfirmDialog from "../../../components/dialogs/confirm-dialog.component";
import { DialogModalContext } from "../../../services/modal/dialog-modal.context";
import { EditPantryScreenRouteName } from "../../../infrastructure/navigation/route-names";

export const PantryLeftIcon = styled(MaterialCommunityIcons).attrs({
  name: "dropbox",
})`
  color: rgba(0, 0, 0, 1);
  font-size: 20px;
  margin-left: 10px;
`;

function PantryListItem({
  item,
  deletePantryCallback,
}: {
  item: IPantry;
  deletePantryCallback: (pantryToDelete: IPantry) => void;
}) {
  const navigation = useNavigation();
  const { showModal, hideModal } = useContext(DialogModalContext);

  const handleEdit = () => {
    navigation.navigate(
      EditPantryScreenRouteName as never,
      {
        pantry: item,
        isEdit: true,
        // eslint-disable-next-line comma-dangle
      } as never
    );
  };

  const handleSelfDelete = () => {
    hideModal();
    deletePantryCallback(item);
  };
  const showConfirmDeletionModal = () => {
    showModal(
      <ConfirmDialog
        confirm="Remove"
        cancel="Cancel"
        dialogContent={`Do you want to delete the pantry '${item.name}'?`}
        dialogTitle="Remove Pantry"
        cancelHandler={hideModal}
        confirmHandler={handleSelfDelete}
      />
    );
  };

  return (
    <ProductListItemContainer>
      <LeftContent>
        <PantryLeftIcon />
        <LeftText>{item.name}</LeftText>
      </LeftContent>
      <RightContent>
        <TouchableOpacity onPress={handleEdit}>
          <EditIcon />
        </TouchableOpacity>
        <TouchableOpacity onPress={showConfirmDeletionModal}>
          <DeleteIcon />
        </TouchableOpacity>
        <TouchableOpacity>
          <AddToPantryIcon />
        </TouchableOpacity>
        <DragHandler />
      </RightContent>
    </ProductListItemContainer>
  );
}

export const PantryListItemKeyExtractor = (p: IPantry) => p.getKey();

export default PantryListItem;
