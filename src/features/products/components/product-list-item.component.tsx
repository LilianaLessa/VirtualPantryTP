// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useContext } from "react";
import { TouchableOpacity } from "react-native";
import {
  AddToPantryIcon,
  AddToShoppingListIcon,
  DeleteIcon,
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
  const {
    productService,
    navigationService,
    snackBarService,
    pantryService,
    shoppingListService,
  } = useContext(DependencyInjectionContext);

  const { showModal, hideModal } = useContext(DialogModalContext);

  const handleSelfDelete = () => {
    hideModal();
    productService.deleteProduct(item, () => {
      snackBarService.showProductDeletedInfo(item);
    });
  };

  const { addItemToShoppingListCallback } = shoppingListService;

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

  const handleAddToShoppingList = () => {
    addItemToShoppingListCallback(item);
  };

  const handleEdit = () => {
    if (typeof addItemToShoppingListCallback === "undefined") {
      navigationService.showEditProductScreen(item);
    } else {
      handleAddToShoppingList();
    }
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
        {typeof addItemToShoppingListCallback === "undefined" && (
          <RightContent>
            {productService.isOwnedByTheCurrentUser(item) && (
              <TouchableOpacity onPress={showConfirmDeletionModal}>
                <DeleteIcon />
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={handleStoreProduct}>
              <AddToPantryIcon />
            </TouchableOpacity>
          </RightContent>
        )}
        {typeof addItemToShoppingListCallback !== "undefined" && (
          <RightContent>
            <TouchableOpacity onPress={handleAddToShoppingList}>
              <AddToShoppingListIcon />
            </TouchableOpacity>
          </RightContent>
        )}
      </ProductListItemContainer>
    </TouchableOpacity>
  );
}

export const ProductListItemKeyExtractor = (p: Product) => p.getKey();
export default ProductListItem;
