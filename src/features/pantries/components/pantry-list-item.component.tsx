import { TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styled from "styled-components";
import { IPantry } from "../interfaces/pantry.interface";
import {
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
import { DependencyInjectionContext } from "../../../services/dependencyInjection/dependency-injection.context";

export const PantryLeftIcon = styled(MaterialCommunityIcons).attrs({
  name: "dropbox",
})`
  color: rgba(0, 0, 0, 1);
  font-size: 20px;
  margin-left: 10px;
`;

function PantryListItem({ item }: { item: IPantry }) {
  const { navigationService, pantryService, snackBarService } = useContext(
    DependencyInjectionContext
  );

  const { showModal, hideModal } = useContext(DialogModalContext);

  const handleEdit = () => {
    navigationService.showEditPantryScreen(item);
  };

  const handleShowContent = () => {
    navigationService.showPantryContentScreen(item);
  };

  const handleSelfDelete = () => {
    hideModal();
    pantryService.deletePantry(item, () => {
      snackBarService.showPantryDeletedInfo(item);
    });
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
    <TouchableOpacity onPress={handleShowContent}>
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
          <DragHandler />
        </RightContent>
      </ProductListItemContainer>
    </TouchableOpacity>
  );
}

export const PantryListItemKeyExtractor = (p: IPantry) => p.getKey();

export default PantryListItem;
