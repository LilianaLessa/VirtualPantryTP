import * as React from "react";
import * as renderer from "react-test-renderer";
import GroupListItem from "../../../../../src/features/group/components/group-list-item.component";
import { createMockGroup } from "../../../../../src/dev-utils";

describe("App", () => {
  it("snapshot test", () => {
    const group = createMockGroup();

    const tree = renderer.create(<GroupListItem group={group} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
