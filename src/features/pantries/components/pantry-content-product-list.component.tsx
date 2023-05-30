import { FlatList, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import PantryContentProductListItem from "./pantry-content-product-list-item.component";
import { DependencyInjectionContext } from "../../../services/dependencyInjection/dependency-injection.context";
import Pantry from "../classes/pantry.class";
import StoredProduct from "../../products/classes/stored.product";

function PantryContentProductList({ pantry }: { pantry: Pantry }) {
  const { pantryService } = useContext(DependencyInjectionContext);

  const [storedProducts, setStoredProducts] = useState(
    pantryService.getPantryContent(pantry)
  );

  useEffect(() => {
    setStoredProducts(pantryService.getPantryContent(pantry));
  }, [pantry, pantryService]);

  const renderItem = ({ item }: { item: StoredProduct }) => (
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
