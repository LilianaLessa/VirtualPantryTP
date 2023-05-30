import * as React from "react";
import * as renderer from "react-test-renderer";
import AddUserInput from "../../../../../src/features/group/components/add-user-input.component";

describe("App", () => {
  it("snapshot test", () => {
    const tree = renderer
      .create(<AddUserInput addUserCallback={() => {}} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
