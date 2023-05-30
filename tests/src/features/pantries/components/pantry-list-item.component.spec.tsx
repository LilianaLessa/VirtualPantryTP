// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import * as React from "react";
import * as renderer from "react-test-renderer";
import { createMockPantry } from "../../../../../src/dev-utils";
import PantryListItem from "../../../../../src/features/pantries/components/pantry-list-item.component";

describe("App", () => {
  it("snapshot test", () => {
    const tree = renderer
      .create(<PantryListItem item={createMockPantry("test")} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
