import React, { useContext, useState } from "react";
import { TouchableOpacity } from "react-native";
import {
  BarCodeScanIcon,
  MagnifyingGlassIcon,
  SearchBarContainer,
  SearchBarInput,
  SearchBarInputContainer,
} from "./product-search-bar.styles";
import { DependencyInjectionContext } from "../../../services/dependencyInjection/dependency-injection.context";

// eslint-disable-next-line react/function-component-definition
const ProductSearchBar = () => {
  const { productService, navigationService, barCodeScanService } = useContext(
    DependencyInjectionContext
  );

  const [term, setTerm] = useState("");

  const navigateToBarcodeScanScreen = () => {
    barCodeScanService.scanBarCode((barCode: string) => {
      navigationService.showProductSearchResultScreen(
        productService.searchProducts({ barCode }),
        { barCode }
      );
    });
  };

  const searchProductByTerm = () => {
    navigationService.showProductSearchResultScreen(
      productService.searchProducts({ term }),
      { term }
    );
  };

  return (
    <SearchBarContainer>
      <SearchBarInputContainer>
        <MagnifyingGlassIcon />
        <SearchBarInput
          placeholder="Search"
          value={term}
          onChangeText={(v) => setTerm(v)}
          onSubmitEditing={searchProductByTerm}
        />
        <TouchableOpacity onPress={navigateToBarcodeScanScreen}>
          <BarCodeScanIcon />
        </TouchableOpacity>
      </SearchBarInputContainer>
    </SearchBarContainer>
  );
};
export default ProductSearchBar;
