import { IStoredProduct } from "../../features/products/interfaces/stored-product.interface";
import { StoredProductActions } from "../actions";
import { StoredProductActionType } from "../action-types";

interface StoredProductsState {
  storedProductsByUuid: Map<string, IStoredProduct>;
  storedProductsByPantryUuid: Map<string, Map<string, IStoredProduct>>;
  storedProductsByProductUuid: Map<string, Map<string, IStoredProduct>>;
  storedProductsByCompositeKey: Map<string, IStoredProduct>;
}

const initialState: StoredProductsState = {
  storedProductsByUuid: new Map<string, IStoredProduct>(),
  storedProductsByPantryUuid: new Map<string, Map<string, IStoredProduct>>(),
  storedProductsByProductUuid: new Map<string, Map<string, IStoredProduct>>(),
  storedProductsByCompositeKey: new Map<string, IStoredProduct>(),
};

const StoredProductsReducer = (
  // eslint-disable-next-line default-param-last
  state: StoredProductsState = initialState,
  // eslint-disable-next-line comma-dangle
  action: StoredProductActions
): StoredProductsState => {
  switch (action.type) {
    case StoredProductActionType.STORE_PRODUCT:
      state.storedProductsByUuid.set(
        action.productToStore.uuid,
        action.productToStore
      );
      state.storedProductsByPantryUuid.set(
        action.productToStore.pantry.uuid,
        (
          state.storedProductsByPantryUuid.get(
            action.productToStore.pantry.uuid
          ) ?? new Map<string, IStoredProduct>()
        ).set(action.productToStore.uuid, action.productToStore)
      );
      state.storedProductsByProductUuid.set(
        action.productToStore.product.uuid,
        (
          state.storedProductsByProductUuid.get(
            action.productToStore.product.uuid
          ) ?? new Map<string, IStoredProduct>()
        ).set(action.productToStore.uuid, action.productToStore)
      );
      state.storedProductsByCompositeKey.set(
        `${action.productToStore.pantry.uuid ?? ""},${
          action.productToStore.product.uuid ?? ""
        }`,
        action.productToStore
      );
      return {
        ...state,
        storedProductsByUuid: new Map(state.storedProductsByUuid),
        storedProductsByPantryUuid: new Map(state.storedProductsByPantryUuid),
        storedProductsByProductUuid: new Map(state.storedProductsByProductUuid),
        storedProductsByCompositeKey: new Map(
          state.storedProductsByCompositeKey
        ),
      };
    case StoredProductActionType.DELETE_STORED_PRODUCT:
      state.storedProductsByUuid.delete(action.storedProductToDelete.uuid);

      state.storedProductsByPantryUuid
        .get(action.storedProductToDelete.pantry.uuid)
        ?.delete(action.storedProductToDelete.uuid);
      state.storedProductsByProductUuid
        .get(action.storedProductToDelete.product.uuid)
        ?.delete(action.storedProductToDelete.uuid);
      // todo this will allow only one instance of a product in a given pantry. fix it.
      state.storedProductsByCompositeKey.delete(
        `${action.storedProductToDelete.pantry.uuid ?? ""},${
          action.storedProductToDelete.product.uuid ?? ""
        }`
      );
      return {
        ...state,
        storedProductsByUuid: new Map(state.storedProductsByUuid),
        storedProductsByPantryUuid: new Map(state.storedProductsByPantryUuid),
        storedProductsByProductUuid: new Map(state.storedProductsByProductUuid),
        storedProductsByCompositeKey: new Map(
          state.storedProductsByCompositeKey
        ),
      };
    default:
      return state;
  }
};

export default StoredProductsReducer;
