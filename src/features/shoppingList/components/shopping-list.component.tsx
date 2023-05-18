import React, { useContext, useState, useEffect } from "react";
import { TouchableOpacity, Text } from "react-native";
import styled from "styled-components";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ProgressBar } from "react-native-paper";
import { default as ShoppingListClass } from "../classes/shopping-list.class";
import {
  DeleteIcon,
  EditIcon,
  LeftContent,
  LeftText,
  ProductListItemContainer,
  RightContent,
} from "../../products/components/product-list-item.styles";
import { DialogModalContext } from "../../../services/modal/dialog-modal.context";
import ConfirmDialog from "../../../components/dialogs/confirm-dialog.component";
import { DependencyInjectionContext } from "../../../services/dependencyInjection/dependency-injection.context";

export const LeftIcon = styled(MaterialCommunityIcons).attrs({
  name: "format-list-bulleted",
})`
  color: rgba(0, 0, 0, 1);
  font-size: 20px;
  margin-left: 10px;
`;

function ShoppingList({ shoppingList }: { shoppingList: ShoppingListClass }) {
  const { showModal, hideModal } = useContext(DialogModalContext);
  const { shoppingListService, navigationService, snackBarService } =
    useContext(DependencyInjectionContext);

  const [progressInfo, setProgressInfo] = useState(
    shoppingListService.getProgressInfo(shoppingList)
  );

  useEffect(() => {
    setProgressInfo(shoppingListService.getProgressInfo(shoppingList));
  }, [shoppingListService, shoppingList]);

  const handleSelfDelete = () => {
    hideModal();
    shoppingListService.deleteShoppingList(shoppingList).then(() => {
      snackBarService.showShoppingListDeletedInfo(shoppingList);
    });
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
    navigationService.showEditShoppingListScreen(shoppingList);
  };

  const handleShoppingListPress = () => {
    navigationService.showUseShoppingListScreen(shoppingList);
  };

  return (
    <TouchableOpacity
      onPress={handleShoppingListPress}
      style={{ marginBottom: 5, paddingLeft: 10, paddingRight: 10 }}
    >
      <ProductListItemContainer>
        <LeftContent>
          <LeftIcon />
          <LeftText>{shoppingList.name}</LeftText>
        </LeftContent>
        <RightContent>
          <Text>{`${progressInfo.boughtItemsAmount}/${progressInfo.totalItemsAmount}`}</Text>
          <TouchableOpacity onPress={handleEdit}>
            <EditIcon />
          </TouchableOpacity>
          <TouchableOpacity onPress={showConfirmDeletionModal}>
            <DeleteIcon />
          </TouchableOpacity>
        </RightContent>
      </ProductListItemContainer>
      <ProgressBar progress={progressInfo.progress} />
    </TouchableOpacity>
  );
}

export default ShoppingList;
