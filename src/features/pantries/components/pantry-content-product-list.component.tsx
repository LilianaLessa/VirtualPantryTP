import { FlatList, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { IStoredProduct } from "../../products/interfaces/stored-product.interface";
import PantryContentProductListItem from "./pantry-content-product-list-item.component";
import { DependencyInjectionContext } from "../../../services/dependencyInjection/dependency-injection.context";
import Pantry from "../classes/pantry.class";

function PantryContentProductList({ pantry }: { pantry: Pantry }) {
  const { pantryService } = useContext(DependencyInjectionContext);

  const [storedProducts, setStoredProducts] = useState(
    pantryService.getPantryContent(pantry)
  );

  useEffect(() => {
    setStoredProducts(pantryService.getPantryContent(pantry));
  }, [pantry, pantryService]);

  const renderItem = ({ item }: { item: IStoredProduct }) => (
    <PantryContentProductListItem storedProduct={item} />
  );

  return (
    <View>
      <FlatList
        data={storedProducts}
        renderItem={renderItem}
        keyExtractor={(p) => p.getKey()}
      />
    </View>
  );
}

export default PantryContentProductList;
