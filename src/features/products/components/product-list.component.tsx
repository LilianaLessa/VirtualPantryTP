import React from "react";
import { FlatList, View } from "react-native";
import ProductListItem, {
  ProductListItemKeyExtractor,
} from "./product-list-item.component";
import { IProduct } from "../interfaces/product.interface";

function ProductList({ products }: { products: IProduct[] }) {
  const renderItem = ({ item }: { item: IProduct }) => (
    <ProductListItem item={item} />
  );

  return (
    <View>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={ProductListItemKeyExtractor}
      />
    </View>
  );
}

export default ProductList;
