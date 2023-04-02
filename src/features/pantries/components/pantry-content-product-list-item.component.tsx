import { TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { IStoredProduct } from "../../products/interfaces/stored-product.interface";
import {
  CookIcon,
  DeleteIcon,
  DragHandler,
  EatIcon,
  EditIcon,
  LeftContent,
  LeftIcon,
  LeftText,
  ProductListItemContainer,
  RightContent,
} from "../../products/components/product-list-item.styles";
import ConfirmDialog from "../../../components/dialogs/confirm-dialog.component";
import { DialogModalContext } from "../../../services/modal/dialog-modal.context";
import { StoreProductScreenRouteName } from "../../../infrastructure/navigation/route-names";

export default function PantryContentProductListItem({
  item,
  deleteProductCallback,
}: {
  item: IStoredProduct;
  deleteProductCallback: (storedProductToDelete: IStoredProduct) => void;
}) {
  const navigation = useNavigation();
  const { showModal, hideModal } = useContext(DialogModalContext);

  const handleSelfDelete = () => {
    hideModal();
    deleteProductCallback(item);
  };

  const showConfirmDeletionModal = () => {
    showModal(
      <ConfirmDialog
        confirm="Remove"
        cancel="Cancel"
        dialogContent={`Do you want to delete the product '${item.product.name}' from the pantry '${item.pantry.name}'?`}
        dialogTitle="Remove Product"
        cancelHandler={hideModal}
        confirmHandler={handleSelfDelete}
      />
    );
  };

  const handleEdit = () => {
    navigation.navigate(
      StoreProductScreenRouteName as never,
      {
        pantry: item.pantry,
        product: item.product,
        // eslint-disable-next-line comma-dangle
      } as never
    );
  };

  return (
    <ProductListItemContainer>
      <LeftContent>
        <LeftIcon />
        <LeftText>
          {item.product.name} x{item.quantity}
        </LeftText>
      </LeftContent>
      <RightContent>
        <TouchableOpacity onPress={handleEdit}>
          <EditIcon />
        </TouchableOpacity>
        <TouchableOpacity>
          <CookIcon />
        </TouchableOpacity>
        <TouchableOpacity>
          <EatIcon />
        </TouchableOpacity>
        <TouchableOpacity onPress={showConfirmDeletionModal}>
          <DeleteIcon />
        </TouchableOpacity>
        <DragHandler />
      </RightContent>
    </ProductListItemContainer>
  );
}

export const PantryContentProductListItemKeyExtractor = (p: IStoredProduct) =>
  p.getKey();
