import React, { useContext } from "react";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styled from "styled-components";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import IShoppingList from "../interfaces/shopping-list.interface";
import {
  DeleteIcon,
  EditIcon,
  LeftContent,
  LeftText,
  ProductListItemContainer,
  RightContent,
} from "../../products/components/product-list-item.styles";
import EditShoppingListScreen from "../screens/edit-shopping-list.screen";
import { DialogModalContext } from "../../../services/modal/dialog-modal.context";
import ConfirmDialog from "../../../components/dialogs/confirm-dialog.component";
import { EditShoppingListScreenRouteName } from "../../../infrastructure/navigation/route-names";

export const LeftIcon = styled(MaterialCommunityIcons).attrs({
  name: "format-list-bulleted",
})`
  color: rgba(0, 0, 0, 1);
  font-size: 20px;
  margin-left: 10px;
`;

function ShoppingList({
  shoppingList,
  deleteShoppingListCallback,
}: {
  shoppingList: IShoppingList;
  deleteShoppingListCallback: (shoppingListToDelete: IShoppingList) => void;
}) {
  const navigation = useNavigation();
  const { showModal, hideModal } = useContext(DialogModalContext);

  const handleSelfDelete = () => {
    hideModal();
    deleteShoppingListCallback(shoppingList);
  };

  const showConfirmDeletionModal = () => {
    showModal(
      <ConfirmDialog
        confirm="Remove"
        cancel="Cancel"
        dialogContent={`Do you want to delete the shopping list '${shoppingList.name}'?`}
        dialogTitle="Remove Shopping List"
        cancelHandler={hideModal}
        confirmHandler={handleSelfDelete}
      />
    );
  };

  const handleEdit = () => {
    navigation.navigate(
      EditShoppingListScreenRouteName as never,
      {
        shoppingList,
        isEdit: true,
        // eslint-disable-next-line comma-dangle
      } as never
    );
  };

  return (
    <ProductListItemContainer>
      <LeftContent>
        <LeftIcon />
        <LeftText>{shoppingList.name}</LeftText>
      </LeftContent>
      <RightContent>
        <TouchableOpacity onPress={handleEdit}>
          <EditIcon />
        </TouchableOpacity>
        <TouchableOpacity onPress={showConfirmDeletionModal}>
          <DeleteIcon />
        </TouchableOpacity>
      </RightContent>
    </ProductListItemContainer>
  );
}

export default ShoppingList;
