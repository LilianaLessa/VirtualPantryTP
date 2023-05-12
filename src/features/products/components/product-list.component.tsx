import React, { useContext } from "react";
import { FlatList, View } from "react-native";
import ProductListItem, {
  ProductListItemKeyExtractor,
} from "./product-list-item.component";
import { IProduct } from "../interfaces/product.interface";
import { useActions } from "../../../hooks/useActions";
import { FirestoreContext } from "../../../services/firebase/firestore.context";

function ProductList({ products }: { products: IProduct[] }) {
  const { deleteProduct } = useActions();
  const { deleteProductOnFirestore } = useContext(FirestoreContext);

  const deleteProductCallback = (item: IProduct) => {
    deleteProductOnFirestore(item);
    deleteProduct(item);
  };
  const renderItem = ({ item }: { item: IProduct }) => (
    <ProductListItem
      item={item}
      deleteProductCallback={deleteProductCallback}
    />
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
