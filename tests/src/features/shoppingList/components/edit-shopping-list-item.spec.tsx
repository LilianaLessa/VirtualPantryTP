// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import * as React from "react";
import * as renderer from "react-test-renderer";
import EditShoppingListItem from "../../../../../src/features/shoppingList/components/edit-shopping-list-item";
import { createMockShoppingListItem } from "../../../../../src/dev-utils";

describe("App", () => {
  it("snapshot test", () => {
    const tree = renderer
      .create(
        <EditShoppingListItem
          shoppingListItem={createMockShoppingListItem()}
          removeItemCallback={() => {}}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
