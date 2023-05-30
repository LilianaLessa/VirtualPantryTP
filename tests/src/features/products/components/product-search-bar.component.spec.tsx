// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import * as React from "react";
import * as renderer from "react-test-renderer";
import ProductSearchBar from "../../../../../src/features/products/components/product-search-bar.component";

describe("App", () => {
  it("snapshot test", () => {
    const tree = renderer
      .create(<ProductSearchBar addItemToShoppingListCallback={() => {}} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
