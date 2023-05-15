import Group from "../../features/group/classes/group.class";
import Product from "../../features/products/classes/product.class";

type StateActions = {
  showSnack: (infoMessage: string) => any;
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

  showGroupSavedInfo(group: Group) {
    this.stateActions?.showSnack(`Group '${group.name}' was saved.`);
  }

  showGroupDeletedInfo(group: Group) {
    this.stateActions?.showSnack(`Group '${group.name}' was deleted.`);
  }
}
