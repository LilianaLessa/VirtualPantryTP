import * as React from "react";
import * as renderer from "react-test-renderer";
import { createMockNotification } from "../../../../../src/dev-utils";
import NotificationRenderer from "../../../../../src/features/notification/components/notification-renderer.component";

describe("App", () => {
  it("snapshot test", () => {
    const notification = createMockNotification();

    const tree = renderer
      .create(<NotificationRenderer notification={notification} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
