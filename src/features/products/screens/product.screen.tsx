import React, { useContext, useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import ProductList from "../components/product-list.component";
import ProductSearchBar from "../components/product-search-bar.component";
import { DependencyInjectionContext } from "../../../services/dependencyInjection/dependency-injection.context";

function ProductScreen() {
  const { productService, navigationService } = useContext(
    DependencyInjectionContext
  );

  const [currentProducts, setCurrentProducts] = useState(
    productService.getProducts()
  );

  useEffect(() => {
    // console.log(productService.products);
    setCurrentProducts(productService.getProducts());
  }, [productService]);

  const handleAddProduct = () => {
    navigationService.showEditProductScreen(productService.createNewProduct());
  };

  return (
    <View>
      <ProductSearchBar />
      <TouchableOpacity onPress={handleAddProduct}>
        <Button mode="contained">
          <Ionicons name="md-add" />
          Add product
        </Button>
      </TouchableOpacity>
      <ProductList products={currentProducts} />
    </View>
  );
}

export default ProductScreen;
