import Group from "../../features/group/classes/group.class";
import Product from "../../features/products/classes/product.class";
import Pantry from "../../features/pantries/classes/pantry.class";
import StoredProduct from "../../features/products/classes/stored.product";
import ShoppingList from "../../features/shoppingList/classes/shopping-list.class";

type StateActions = {
  showSnack: (infoMessage: string) => any;
  showErrorSnack: (errorMessage: string) => any;
};
export default class SnackBarService {
  private stateActions?: StateActions;

  constructor(stateActions?: StateActions) {
    this.stateActions = stateActions;
  }

  showProductSavedInfo(product: Product) {
    this.stateActions?.showSnack(`Product '${product.name}' was saved.`);
  }

  showProductDeletedInfo(product: Product) {
    this.stateActions?.showSnack(`Product '${product.name}' was deleted.`);
  }

  showPantrySavedInfo(pantry: Pantry) {
    this.stateActions?.showSnack(`Pantry '${pantry.name}' was saved.`);
  }

  showPantryDeletedInfo(pantry: Pantry) {
    this.stateActions?.showSnack(`Pantry '${pantry.name}' was deleted.`);
  }

  showGroupSavedInfo(group: Group) {
    this.stateActions?.showSnack(`Group '${group.name}' was saved.`);
  }

  showGroupNotSavedError(group: Group, message?: string) {
    this.stateActions?.showErrorSnack(
      `It was not possible to save the Group '${group.name}'. ${message}`
    );
  }

  groupInviteAcceptedInfo(groupName: string) {
    this.stateActions?.showSnack(
      `You accepted the invite to group '${groupName}'.`
    );
  }

  groupInviteRejectedInfo(groupName: string) {
    this.stateActions?.showSnack(
      `You rejected the invite to group '${groupName}'.`
    );
  }

  showGroupDeletedInfo(group: Group) {
    this.stateActions?.showSnack(`Group '${group.name}' was deleted.`);
  }

  showLeftGroupInfo(group: Group) {
    this.stateActions?.showSnack(`You left the Group '${group.name}'.`);
  }

  showProductStoredInfo(
    storedProduct: StoredProduct,
    pantry?: Pantry,
    product?: Product
  ) {
    const name = storedProduct.name ?? product?.name;
    const productName =
      product?.name && name !== product?.name ? ` (${product?.name})` : "";
    this.stateActions?.showSnack(
      `'${name}${productName}' was stored at '${pantry?.name ?? "no pantry"}'`
    );
  }

  showStoredProductDeletedInfo(
    storedProduct: StoredProduct,
    pantry?: Pantry,
    product?: Product
  ) {
    const name =
      storedProduct.name?.length > 0 ? storedProduct.name : product?.name;
    const productName =
      product?.name && name !== product?.name ? ` (${product?.name})` : "";
    this.stateActions?.showSnack(
      `'${name}${productName}' was deleted from '${
        pantry?.name ?? "no pantry"
      }'`
    );
  }

  showShoppingListSavedInfo(shoppingList: ShoppingList) {
    this.stateActions?.showSnack(
      `Shopping List '${shoppingList.name}' was saved.`
    );
  }

  showShoppingListDeletedInfo(shoppingList: ShoppingList) {
    this.stateActions?.showSnack(
      `Shopping List '${shoppingList.name}' was deleted.`
    );
  }

  showNotificationsClearedInfo() {
    this.stateActions?.showSnack("Notifications cleared.");
  }

  showConfigurationSavedInfo() {
    this.stateActions?.showSnack("Configuration saved.");
  }
}
