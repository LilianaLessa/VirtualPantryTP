import { FlatList, View } from "react-native";
import ProductListItem, {
  ProductListItemKeyExtractor,
} from "./product-list-item.component";
import { useTypedSelector } from "../../../hooks/useTypedSelector";
import { IProduct } from "../interfaces/product.interface";
import { useActions } from "../../../hooks/useActions";

function ProductList() {
  const { products } = useTypedSelector((state) => state.savedProducts);
  const { deleteProduct } = useActions();

  const deleteProductCallback = (item: IProduct) => deleteProduct(item);
  const renderItem = ({ item }: { item: IProduct }) => (
    <ProductListItem
      item={item}
      deleteProductCallback={deleteProductCallback}
    />
  );

  return (
    <View>
      <FlatList
        data={Array.from(products.values())}
        renderItem={renderItem}
        keyExtractor={ProductListItemKeyExtractor}
      />
    </View>
  );
}

export default ProductList;
