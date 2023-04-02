import { FlatList, View } from "react-native";
import React, { useEffect, useState } from "react";
import { IPantry } from "../interfaces/pantry.interface";
import { useActions } from "../../../hooks/useActions";
import { IStoredProduct } from "../../products/interfaces/stored-product.interface";
import PantryContentProductListItem, {
  PantryContentProductListItemKeyExtractor,
} from "./pantry-content-product-list-item.component";
import { useTypedSelector } from "../../../hooks/useTypedSelector";

function PantryContentProductList({ pantry }: { pantry: IPantry }) {
  const { deleteStoredProduct } = useActions();

  const { storedProductsByPantryUuid } = useTypedSelector(
    (state) => state.storedProductsByPantryUuid
  );
  const [storedProducts, setStoredProducts] = useState(
    Array.from(storedProductsByPantryUuid.get(pantry.uuid)?.values() ?? [])
  );

  useEffect(() => {
    setStoredProducts(
      Array.from(storedProductsByPantryUuid.get(pantry.uuid)?.values() ?? [])
    );
  }, [storedProductsByPantryUuid]);

  const deleteProductCallback = (storedProductToDelete: IStoredProduct) => {
    deleteStoredProduct(storedProductToDelete);
  };

  const renderItem = ({ item }: { item: IStoredProduct }) => (
    <PantryContentProductListItem
      item={item}
      deleteProductCallback={deleteProductCallback}
    />
  );

  return (
    <View>
      <FlatList
        data={storedProducts}
        renderItem={renderItem}
        keyExtractor={PantryContentProductListItemKeyExtractor}
      />
    </View>
  );
}

export default PantryContentProductList;
