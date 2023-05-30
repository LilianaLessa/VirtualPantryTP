import * as React from "react";
import * as renderer from "react-test-renderer";
import UserListItem from "../../../../../src/features/group/components/user-list-item.component";
import {
  createMockGroup,
  createMockUserInGroup,
} from "../../../../../src/dev-utils";

describe("App", () => {
  it("snapshot test", () => {
    const group = createMockGroup();
    const userInGroup = createMockUserInGroup(group);

    const tree = renderer
      .create(
        <UserListItem
          group={group}
          userInGroup={userInGroup}
          deleteUserInGroupCallback={() => {}}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
