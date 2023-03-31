import React, { useContext, useState } from "react";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BarCodeScannerContext } from "../../../services/barCodeScanner/barCodeScanner.context";
import {
  BarCodeScanScreenRouteName,
  ProductSearchResultScreenRouteName,
} from "../../../infrastructure/navigation/route-names";
import {
  BarCodeScanIcon,
  MagnifyingGlassIcon,
  SearchBarContainer,
  SearchBarInput,
  SearchBarInputContainer,
} from "./product-search-bar.styles";

// eslint-disable-next-line react/function-component-definition
const ProductSearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();

  const { setOnBarCodeScannedCallback } = useContext(BarCodeScannerContext);

  const searchProductByBarCode = (barCode: string) => {
    navigation.navigate(
      ProductSearchResultScreenRouteName as never,
      {
        barCode,
        // eslint-disable-next-line comma-dangle
      } as never
    );
  };

  const onBarCodeScanned = (barCode: string) => {
    searchProductByBarCode(barCode);
  };
  const navigateToBarcodeScanScreen = () => {
    setOnBarCodeScannedCallback(onBarCodeScanned);
    navigation.navigate(BarCodeScanScreenRouteName as never);
  };

  const searchProductByTerm = (term: string) => {
    navigation.navigate(
      ProductSearchResultScreenRouteName as never,
      {
        term,
        // eslint-disable-next-line comma-dangle
      } as never
    );
  };

  const searchProduct = () => {
    const term = searchQuery;
    setSearchQuery("");
    searchProductByTerm(term);
  };

  return (
    <SearchBarContainer>
      <SearchBarInputContainer>
        <MagnifyingGlassIcon />
        <SearchBarInput
          placeholder="Search"
          value={searchQuery}
          onChangeText={(v) => setSearchQuery(v)}
          onSubmitEditing={searchProduct}
        />
        <TouchableOpacity onPress={navigateToBarcodeScanScreen}>
          <BarCodeScanIcon />
        </TouchableOpacity>
      </SearchBarInputContainer>
    </SearchBarContainer>
  );
};
export default ProductSearchBar;
