import { RouteProp } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";
import ProductList from "../components/product-list.component";
import Product from "../classes/product.class";
import OpenFoodFacts from "../../../services/productDataProvider/OpenFoodFacts";
import { ProductSearchQuery } from "../services/product.service";
import { DependencyInjectionContext } from "../../../services/dependencyInjection/dependency-injection.context";

export type ProductSearchResultsScreenParams = {
  ProductSearchResult: {
    products: Product[];
    query: Partial<ProductSearchQuery>;
  };
};
type Props = RouteProp<ProductSearchResultsScreenParams, "ProductSearchResult">;

export function ProductSearchResultScreen({
  route: {
    params: { products, query },
  },
}: {
  route: Props;
}) {
  const { productService, navigationService, shoppingListService } = useContext(
    DependencyInjectionContext
  );

  const [searchResults, setSearchResults] = useState(products);

  useEffect(() => {
    setSearchResults(productService.searchProducts(query));
  }, [productService, query]);

  const defaultCreationHandler = () => {
    console.error(
      "Unsupported creation handler: Something wrong is not right."
    );
  };

  const handleCreateFromBarCode = () => {
    new OpenFoodFacts(productService).getProductByBarCode(
      query.barCode ?? "",
      (product: Product) => {
        navigationService.showEditProductScreen(
          product.clone({
            barCode: query.barCode ?? "",
          })
        );
      },
      () => {
        navigationService.showEditProductScreen(
          productService.createNewProduct({ barCode: query.barCode ?? "" })
        );
      }
    );
  };

  const handleCreateFromTerm = () => {
    navigationService.showEditProductScreen(
      productService.createNewProduct({ name: query.term ?? "" })
    );
  };

  if (searchResults.length === 0) {
    let noProductsFoundMessage = "No product was found";
    let creationHandler = defaultCreationHandler;

    if (typeof query.barCode !== "undefined") {
      creationHandler = handleCreateFromBarCode;
      noProductsFoundMessage += `by the barcode '${query.barCode}'`;
    } else if (typeof query.term !== "undefined") {
      creationHandler = handleCreateFromTerm;
      noProductsFoundMessage += `by the term '${query.term}'`;
    }
    noProductsFoundMessage += ".";

    const { addItemToShoppingListCallback } = shoppingListService;

    return (
      <View>
        <Text>{noProductsFoundMessage}</Text>
        {typeof addItemToShoppingListCallback === "undefined" && (
          <Button mode="contained" onPress={creationHandler}>
            Create
          </Button>
        )}
      </View>
    );
  }

  return <ProductList products={searchResults} />;
}
