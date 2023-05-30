// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import * as React from "react";
import * as renderer from "react-test-renderer";
import ProductList from "../../../../../src/features/products/components/product-list.component";

describe("App", () => {
  it("snapshot test", () => {
    const tree = renderer.create(<ProductList products={[]} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
