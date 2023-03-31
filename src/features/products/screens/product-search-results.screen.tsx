import { RouteProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";
// eslint-disable-next-line import/no-extraneous-dependencies
import { HeaderBackButton } from "@react-navigation/elements";
// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 as uuidv4 } from "uuid";
import { IProduct } from "../interfaces/product.interface";
import ProductList from "../components/product-list.component";
import Product from "../classes/product";
import OpenFoodFacts from "../../../services/productDataProvider/OpenFoodFacts";
import { useTypedSelector } from "../../../hooks/useTypedSelector";
import {
  EditProductScreenRouteName,
  ProductScreenRouteName,
} from "../../../infrastructure/navigation/route-names";

export type ProductSearchResultsScreenParams = {
  ProductSearchResult: {
    term?: string;
    barCode?: string;
  };
};
type Props = RouteProp<ProductSearchResultsScreenParams, "ProductSearchResult">;

const doSearch = (
  products: IProduct[],
  term?: string,
  barCode?: string
): IProduct[] => {
  if (typeof term === "string") {
    return products.filter((product: IProduct) =>
      product.name.toLowerCase().includes(term.toLowerCase())
    );
  }

  if (typeof barCode === "string") {
    return products.filter((product: IProduct) => product.barCode === barCode);
  }

  return [];
};

export function ProductSearchResultScreen({ route }: { route: Props }) {
  const navigation = useNavigation();
  const { savedProducts } = useTypedSelector((state) => state.savedProducts);
  const [results, setResults] = useState<IProduct[]>([]);
  const { term, barCode } = route.params ?? {
    term: "",
    barCode: "",
  };

  useEffect(() => {
    setResults(doSearch(Array.from(savedProducts.values()), term, barCode));
  }, [savedProducts]);

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
