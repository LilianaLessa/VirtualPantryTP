// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import * as React from "react";
import * as renderer from "react-test-renderer";
import ShoppingLists from "../../../../../src/features/shoppingList/components/shopping-lists.component";

describe("App", () => {
  it("snapshot test", () => {
    const tree = renderer.create(<ShoppingLists shoppingLists={[]} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
