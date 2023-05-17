import React, { useContext } from "react";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  AddToPantryIcon,
  DeleteIcon,
  DragHandler,
  LeftContent,
  LeftIcon,
  LeftText,
  ProductListItemContainer,
  RightContent,
} from "./product-list-item.styles";
import ConfirmDialog from "../../../components/dialogs/confirm-dialog.component";
import { DialogModalContext } from "../../../services/modal/dialog-modal.context";
import { DependencyInjectionContext } from "../../../services/dependencyInjection/dependency-injection.context";
import Product from "../classes/product.class";

function ProductListItem({ item }: { item: Product }) {
  const { productService, navigationService, snackBarService, pantryService } =
    useContext(DependencyInjectionContext);

  const navigation = useNavigation();
  const { showModal, hideModal } = useContext(DialogModalContext);

  const handleSelfDelete = () => {
    hideModal();
    productService.deleteProduct(item, () => {
      snackBarService.showProductDeletedInfo(item);
    });
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
    navigationService.showStoreProductScreen(
      pantryService.createStoredProduct({
        productUuid: item.uuid,
      })
    );
  };

  return (
    <TouchableOpacity onPress={handleEdit}>
      <ProductListItemContainer>
        <LeftContent>
          <LeftIcon />
          <LeftText>{item.name}</LeftText>
        </LeftContent>
        <RightContent>
          <TouchableOpacity onPress={showConfirmDeletionModal}>
            <DeleteIcon />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleStoreProduct}>
            <AddToPantryIcon />
          </TouchableOpacity>
          <DragHandler />
        </RightContent>
      </ProductListItemContainer>
    </TouchableOpacity>
  );
}

export const ProductListItemKeyExtractor = (p: Product) => p.getKey();
export default ProductListItem;
