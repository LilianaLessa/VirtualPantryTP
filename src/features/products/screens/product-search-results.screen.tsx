import { RouteProp, useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";
import { HeaderBackButton } from "@react-navigation/elements";
import { v4 as uuidv4 } from "uuid";
import { IProduct } from "../interfaces/product.interface";
import ProductList from "../components/product-list.component";
import { ProductScreenRouteName } from "./product.screen";
import Product from "../classes/product";
import { EditProductScreenRouteName } from "./edit-product.screen";
import OpenFoodFacts from "../../../services/productDataProvider/OpenFoodFacts";

export const ProductSearchResultScreenRouteName = "ProductSearchResult";
export type ProductSearchResultsScreenParams = {
  ProductSearchResult: {
    results: IProduct[];
    term?: string;
    barCode?: string;
  };
};
type Props = RouteProp<ProductSearchResultsScreenParams, "ProductSearchResult">;

export function ProductSearchResultScreen({ route }: { route: Props }) {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderBackButton
          onPress={() => {
            navigation.navigate(ProductScreenRouteName as never);
          }}
        />
      ),
    });
  }, [navigation]);

  const { results, term, barCode } = route.params ?? {
    results: [],
    term: "",
    barCode: "",
  };

  const navigateToProductCreation = (product: IProduct) => {
    navigation.navigate(
      EditProductScreenRouteName as never,
      {
        product,
        routeToNavigateOnSave: ProductScreenRouteName,
        // eslint-disable-next-line comma-dangle
      } as never
    );
  };
  const handleCreateFromBarcode = () => {
    new OpenFoodFacts().getProductByBarCode(
      barCode ?? "",
      (product: IProduct) => {
        navigateToProductCreation(
          product.clone({
            barCode: barCode ?? "",
          })
        );
      },
      () => {
        navigateToProductCreation(new Product(uuidv4(), barCode));
      }
    );
  };

  const handleCreateFromTerm = () => {
    navigateToProductCreation(new Product(uuidv4(), "", term));
  };

  if (results.length === 0) {
    if (typeof term !== "undefined") {
      return (
        <View>
          <Text>
            No product was found with the name '{term}
            '.
          </Text>
          <Button mode="contained" onPress={handleCreateFromTerm}>
            Create
          </Button>
        </View>
      );
    }

    if (typeof barCode !== "undefined") {
      return (
        <View>
          <Text>
            No product was found with the barcode '{barCode}
            '.
          </Text>
          <Button mode="contained" onPress={handleCreateFromBarcode}>
            Create
          </Button>
        </View>
      );
    }
  }

  return <ProductList products={results} />;
}
