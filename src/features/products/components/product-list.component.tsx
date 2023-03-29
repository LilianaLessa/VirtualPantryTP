import React from "react";
import { FlatList, View } from "react-native";
import ProductListItem, {
  ProductListItemKeyExtractor,
} from "./product-list-item.component";
import { useTypedSelector } from "../../../hooks/useTypedSelector";

function ProductList() {
  const { products } = useTypedSelector((state) => state.savedProducts);

  return (
    <View>
      <FlatList
        data={products}
        renderItem={ProductListItem}
        keyExtractor={ProductListItemKeyExtractor}
      />
    </View>
  );
}

export default ProductList;
