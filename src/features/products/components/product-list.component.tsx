import React from "react";
import { FlatList, Text, View } from "react-native";
import Product from "../classes/product.class";
import ProductListItem, {
  ProductListItemKeyExtractor,
} from "./product-list-item.component";

function ProductList() {
  const productList: Product[] = [new Product("test1"), new Product("test2")];

  return (
    <View>
      <Text>Product List</Text>
      <FlatList
        data={productList}
        renderItem={ProductListItem}
        keyExtractor={ProductListItemKeyExtractor}
      />
    </View>
  );
}

export default ProductList;
