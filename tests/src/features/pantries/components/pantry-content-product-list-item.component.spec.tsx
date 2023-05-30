import * as React from "react";
import * as renderer from "react-test-renderer";
import PantryContentProductListItem from "../../../../../src/features/pantries/components/pantry-content-product-list-item.component";
import { createMockStoredProduct } from "../../../../../src/dev-utils";

describe("App", () => {
  it("snapshot test", () => {
    const storedProduct = createMockStoredProduct();

    const tree = renderer
      .create(<PantryContentProductListItem storedProduct={storedProduct} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
