// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import * as React from "react";
import * as renderer from "react-test-renderer";
import { createMockProduct } from "../../../../../src/dev-utils";
import ProductListItem from "../../../../../src/features/products/components/product-list-item.component";

describe("App", () => {
  it("snapshot test", () => {
    const tree = renderer
      .create(<ProductListItem item={createMockProduct("test")} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
