// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import * as React from "react";
import * as renderer from "react-test-renderer";
import PantryList from "../../../../../src/features/pantries/components/pantry-list.component";

describe("App", () => {
  it("snapshot test", () => {
    const tree = renderer.create(<PantryList pantries={[]} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
