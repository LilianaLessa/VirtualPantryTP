import React, { useContext, useEffect, useState } from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styled from "styled-components";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ProgressBar } from "react-native-paper";
import IShoppingList from "../interfaces/shopping-list.interface";
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
import { EditShoppingListScreenRouteName } from "../../../infrastructure/navigation/route-names";
import IShoppingListItem from "../interfaces/shopping-list-item.interface";
import { useTypedSelector } from "../../../hooks/useTypedSelector";

function countBoughtItems(shoppingList: IShoppingList): number {
  return shoppingList.items.filter((i: IShoppingListItem) => i.bought).length;
}
function countItems(shoppingList: IShoppingList): number {
  return shoppingList.items.length;
}

export const RightContentModified = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

export const ProductListItemContainerModified = styled(View)`
  background-color: #e6e6e6;
  flex-direction: row;
  align-self: baseline;
  border-color: #000000;
`;

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
  const { shoppingLists } = useTypedSelector((state) => state.shoppingLists);
  const navigation = useNavigation();
  const [boughtItemsAmount, setBoughtItemsAmount] = useState(
    countBoughtItems(shoppingList)
  );
  const [totalItemsAmount, setTotalItemsAmount] = useState(
    countItems(shoppingList)
  );

  useEffect(() => {
    setBoughtItemsAmount(countBoughtItems(shoppingList));
    setTotalItemsAmount(countItems(shoppingList));
  }, [shoppingList, shoppingLists]);

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

  function calculateProgress(): number {
    return totalItemsAmount === 0 ? 0 : boughtItemsAmount / totalItemsAmount;
  }

  return (
    <TouchableOpacity
      style={{ marginBottom: 5, paddingLeft: 10, paddingRight: 10 }}
    >
      <ProductListItemContainer>
        <LeftContent>
          <LeftIcon />
          <LeftText>{shoppingList.name}</LeftText>
        </LeftContent>
        <RightContent>
          <Text>{`${boughtItemsAmount}/${totalItemsAmount}`}</Text>
          <TouchableOpacity onPress={handleEdit}>
            <EditIcon />
          </TouchableOpacity>
          <TouchableOpacity onPress={showConfirmDeletionModal}>
            <DeleteIcon />
          </TouchableOpacity>
        </RightContent>
      </ProductListItemContainer>
      <ProgressBar progress={calculateProgress()} />
    </TouchableOpacity>
  );
}

export default ShoppingList;
