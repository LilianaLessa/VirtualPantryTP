// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import * as React from "react";
import * as renderer from "react-test-renderer";
import { createMockShoppingList } from "../../../../../src/dev-utils";
import ShoppingList from "../../../../../src/features/shoppingList/components/shopping-list.component";

describe("App", () => {
  it("snapshot test", () => {
    const tree = renderer
      .create(
        <ShoppingList
          shoppingList={createMockShoppingList()}
          removeItemCallback={() => {}}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
