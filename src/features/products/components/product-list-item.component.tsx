import React, { useContext } from "react";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { IProduct } from "../interfaces/product.interface";
import { StoreProductScreenRouteName } from "../../../infrastructure/navigation/route-names";
import {
  AddToPantryIcon,
  DeleteIcon,
  DragHandler,
  EditIcon,
  LeftContent,
  LeftIcon,
  LeftText,
  ProductListItemContainer,
  RightContent,
} from "./product-list-item.styles";
import ConfirmDialog from "../../../components/dialogs/confirm-dialog.component";
import { DialogModalContext } from "../../../services/modal/dialog-modal.context";
import { DependencyInjectionContext } from "../../../services/dependencyInjection/dependency-injection.context";

function ProductListItem({
  item,
  deleteProductCallback,
}: {
  item: IProduct;
  deleteProductCallback: (productToDelete: IProduct) => void;
}) {
  const { navigationService } = useContext(DependencyInjectionContext);

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
        dialogContent={`Do you want to delete the product '${item.name}'?`}
        dialogTitle="Remove Product"
        cancelHandler={hideModal}
        confirmHandler={handleSelfDelete}
      />
    );
  };

  const handleEdit = () => {
    navigationService.showEditProductScreen(item);
  };

  const handleStoreProduct = () => {
    navigation.navigate(
      StoreProductScreenRouteName as never,
      {
        product: item,
      } as never
    );
  };

  return (
    <ProductListItemContainer>
      <LeftContent>
        <LeftIcon />
        <LeftText>{item.name}</LeftText>
      </LeftContent>
      <RightContent>
        <TouchableOpacity onPress={handleEdit}>
          <EditIcon />
        </TouchableOpacity>
        <TouchableOpacity onPress={showConfirmDeletionModal}>
          <DeleteIcon />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleStoreProduct}>
          <AddToPantryIcon />
        </TouchableOpacity>
        <DragHandler />
      </RightContent>
    </ProductListItemContainer>
  );
}

export const ProductListItemKeyExtractor = (p: IProduct) => p.getKey();
export default ProductListItem;
