import { TouchableOpacity } from "react-native";
import React, { useContext, useState, useEffect } from "react";
import {
  CookIcon,
  DeleteIcon,
  DiscardIcon,
  DragHandler,
  EatIcon,
  ExpireIcon,
  LeftContent,
  LeftIcon,
  LeftText,
  ProductListItemContainer,
  RightContent,
} from "../../products/components/product-list-item.styles";
import ConfirmDialog from "../../../components/dialogs/confirm-dialog.component";
import { DialogModalContext } from "../../../services/modal/dialog-modal.context";
import StoredProduct from "../../products/classes/stored.product";
import { DependencyInjectionContext } from "../../../services/dependencyInjection/dependency-injection.context";
import ActionDialog from "./ActionDialog";

export default function PantryContentProductListItem({
  storedProduct,
}: {
  storedProduct: StoredProduct;
}) {
  const { productService, navigationService, pantryService, snackBarService } =
    useContext(DependencyInjectionContext);
  const { showModal, hideModal } = useContext(DialogModalContext);

  const [product, setProduct] = useState(
    productService.getProductByUuid(storedProduct.productUuid)
  );
  const [pantry, setPantry] = useState(
    pantryService.getPantryByUuid(storedProduct.productUuid)
  );

  useEffect(() => {
    setProduct(productService.getProductByUuid(storedProduct.productUuid));
  }, [storedProduct, productService]);

  useEffect(() => {
    setPantry(pantryService.getPantryByUuid(storedProduct.productUuid));
  }, [storedProduct, pantryService]);

  const handleSelfDelete = () => {
    hideModal();
    pantryService.deleteStoredProduct(storedProduct, () => {
      snackBarService.showStoredProductDeletedInfo(
        storedProduct,
        pantryService.getPantryByUuid(storedProduct.pantryUuid),
        productService.getProductByUuid(storedProduct.productUuid)
      );
    });
  };

  const showConfirmDeletionModal = () => {
    showModal(
      <ConfirmDialog
        confirm="Remove"
        cancel="Cancel"
        dialogContent={`Do you want to delete the product '${product?.name}' from the pantry '${pantry?.name}'?`}
        dialogTitle="Remove Product"
        cancelHandler={hideModal}
        confirmHandler={handleSelfDelete}
      />
    );
  };

  const savePrepared = (quantity: number) => {
    const updatedStoredProduct = storedProduct.clone({
      prepared: storedProduct.prepared + quantity,
    });
    pantryService.storeProduct(updatedStoredProduct, () => {
      snackBarService.showStoredItemConsumedInfo(
        pantryService.getStoredProductDisplayName(storedProduct, product),
        quantity,
        "prepared"
      );
    });
  };

  const showPrepareDialog = () => {
    showModal(
      <ActionDialog
        Icon={CookIcon}
        title="Prepare"
        saveHandler={savePrepared}
      />
    );
  };

  const saveEaten = (quantity: number) => {
    const updatedStoredProduct = storedProduct.clone({
      eaten: storedProduct.eaten + quantity,
    });
    pantryService.storeProduct(updatedStoredProduct, () => {
      snackBarService.showStoredItemConsumedInfo(
        pantryService.getStoredProductDisplayName(storedProduct, product),
        quantity,
        "eaten"
      );
    });
  };
  const showEatDialog = () => {
    showModal(
      <ActionDialog Icon={EatIcon} title="Eat" saveHandler={saveEaten} />
    );
  };

  const saveExpired = (quantity: number) => {
    const updatedStoredProduct = storedProduct.clone({
      expired: storedProduct.expired + quantity,
    });
    pantryService.storeProduct(updatedStoredProduct, () => {
      snackBarService.showStoredItemConsumedInfo(
        pantryService.getStoredProductDisplayName(storedProduct, product),
        quantity,
        "expired"
      );
    });
  };
  const showExpireDialog = () => {
    showModal(
      <ActionDialog
        Icon={ExpireIcon}
        title="Expire"
        saveHandler={saveExpired}
      />
    );
  };

  const saveDiscarded = (quantity: number) => {
    const updatedStoredProduct = storedProduct.clone({
      discarded: storedProduct.discarded + quantity,
    });
    pantryService.storeProduct(updatedStoredProduct, () => {
      snackBarService.showStoredItemConsumedInfo(
        pantryService.getStoredProductDisplayName(storedProduct, product),
        quantity,
        "discarded"
      );
    });
  };

  const showDiscardDialog = () => {
    showModal(
      <ActionDialog
        Icon={DiscardIcon}
        title="Discard"
        saveHandler={saveDiscarded}
      />
    );
  };

  const handleEdit = () => {
    navigationService.showStoreProductScreen(storedProduct);
  };

  return (
    <TouchableOpacity onPress={handleEdit}>
      <ProductListItemContainer>
        <LeftContent>
          <LeftIcon />
          <LeftText>
            {`${pantryService.getStoredProductDisplayName(
              storedProduct,
              product
            )} x${storedProduct.quantity}`}
          </LeftText>
        </LeftContent>
        <RightContent>
          <TouchableOpacity onPress={showPrepareDialog}>
            <CookIcon />
          </TouchableOpacity>
          <TouchableOpacity onPress={showEatDialog}>
            <EatIcon />
          </TouchableOpacity>
          <TouchableOpacity onPress={showExpireDialog}>
            <ExpireIcon />
          </TouchableOpacity>
          <TouchableOpacity onPress={showDiscardDialog}>
            <DiscardIcon />
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
