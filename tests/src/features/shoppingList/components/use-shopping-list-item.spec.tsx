// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import * as React from "react";
import * as renderer from "react-test-renderer";
import { createMockShoppingListItem } from "../../../../../src/dev-utils";
import UseShoppingListItem from "../../../../../src/features/shoppingList/components/use-shopping-list-item";

describe("App", () => {
  it("snapshot test", () => {
    const tree = renderer
      .create(
        <UseShoppingListItem shoppingListItem={createMockShoppingListItem()} />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
