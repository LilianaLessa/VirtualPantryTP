import { TouchableOpacity } from "react-native";
import React, { useContext, useState, useEffect } from "react";
import {
  CookIcon,
  DeleteIcon,
  DragHandler,
  EatIcon,
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
import Product from "../../products/classes/product.class";

function getStoredProductDisplayName(
  storedProduct: StoredProduct,
  product?: Product
): string {
  const name =
    storedProduct.name?.length > 0 ? storedProduct.name : product?.name;
  const productName =
    product?.name && name !== product?.name ? ` (${product?.name})` : "";

  return `${name}${productName}`;
}

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
    </TouchableOpacity>
  );
}
