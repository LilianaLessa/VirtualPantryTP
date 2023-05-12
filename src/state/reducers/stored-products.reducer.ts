import { IStoredProduct } from "../../features/products/interfaces/stored-product.interface";
import { StoredProductActions } from "../actions";
import { StoredProductActionType } from "../action-types";
import DbContext from "../../services/applicationData/localDatabase/classes/db-context.class";
import StoredProduct from "../../features/products/classes/stored.product";
import { LocalTable } from "../../services/applicationData/localDatabase/tables";

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
  function insertStoredProductOnState(
    currentState: StoredProductsState,
    productToStore: IStoredProduct
  ) {
    currentState.storedProductsByUuid.set(productToStore.uuid, productToStore);
    currentState.storedProductsByPantryUuid.set(
      productToStore.pantry.uuid,
      (
        currentState.storedProductsByPantryUuid.get(
          productToStore.pantry.uuid
        ) ?? new Map<string, IStoredProduct>()
      ).set(productToStore.uuid, productToStore)
    );
    currentState.storedProductsByProductUuid.set(
      productToStore.product.uuid,
      (
        currentState.storedProductsByProductUuid.get(
          productToStore.product.uuid
        ) ?? new Map<string, IStoredProduct>()
      ).set(productToStore.uuid, productToStore)
    );
    currentState.storedProductsByCompositeKey.set(
      `${productToStore.pantry.uuid ?? ""},${
        productToStore.product.uuid ?? ""
      }`,
      productToStore
    );
    return {
      ...currentState,
      storedProductsByUuid: new Map(currentState.storedProductsByUuid),
      storedProductsByPantryUuid: new Map(
        currentState.storedProductsByPantryUuid
      ),
      storedProductsByProductUuid: new Map(
        currentState.storedProductsByProductUuid
      ),
      storedProductsByCompositeKey: new Map(
        currentState.storedProductsByCompositeKey
      ),
    };
  }

  switch (action.type) {
    case StoredProductActionType.STORE_PRODUCT:
      DbContext.getInstance()
        .database.save(action.productToStore as StoredProduct)
        .then(() => {
          console.log("StoredProduct Persisted. Id:", action.productToStore.id);
        })
        .catch(() => {
          console.log("StoredProduct persisting error");
        });

      return insertStoredProductOnState(state, action.productToStore);
    case StoredProductActionType.DELETE_STORED_PRODUCT:
      DbContext.getInstance()
        .database.delete(
          action.storedProductToDelete as StoredProduct,
          LocalTable.STORED_PRODUCT
        )
        .then(() => {
          console.log("StoredProduct deleted", action.storedProductToDelete.id);
        })
        .catch(() => {
          console.log("StoredProduct deletion error");
        });
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
    case StoredProductActionType.INIT_STORED_PRODUCT_COLLECTION:
      console.log("init stored product collection");
      let newState = state;
      action.storedProductCollection.forEach((p) => {
        newState = {
          ...newState,
          ...insertStoredProductOnState(newState, p),
        };
      });

      return newState;
    default:
      return state;
  }
};

export default StoredProductsReducer;
