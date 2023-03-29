import { Text, View } from "react-native";
import React from "react";
import { IProduct } from "../interfaces/product.interface";

function ProductListItem({ item }: { item: IProduct }) {
  return (
    <View>
      <Text>{item.name}</Text>
    </View>
  );
}

export const ProductListItemKeyExtractor = (p: IProduct) => p.name;
export default ProductListItem;
