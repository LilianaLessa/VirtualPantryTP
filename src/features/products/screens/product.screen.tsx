import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import ProductList from "../components/product-list.component";
import ProductSearchBar from "../components/product-search-bar.component";
import { useTypedSelector } from "../../../hooks/useTypedSelector";

function ProductScreen() {
  const navigation = useNavigation();
  const { savedProducts } = useTypedSelector((state) => state.savedProducts);
  const [products, setProducts] = useState(Array.from(savedProducts.values()));

  useEffect(() => {
    setProducts(Array.from(savedProducts.values()));
  }, [savedProducts]);

  const handleAddProduct = () => {
    navigation.navigate("EditProduct" as never);
  };

  return (
    <View>
      <ProductSearchBar products={products} />
      <TouchableOpacity onPress={handleAddProduct}>
        <Button mode="contained">
          <Ionicons name="md-add" />
          TMP add product
        </Button>
      </TouchableOpacity>
      <ProductList products={products} />
    </View>
  );
}

export default ProductScreen;
