import * as React from "react";
import * as renderer from "react-test-renderer";
import NotificationDeleteButton from "../../../../../src/features/notification/components/notification-delete-button.component";
import { createMockNotification } from "../../../../../src/dev-utils";

describe("App", () => {
  it("snapshot test", () => {
    const notification = createMockNotification();

    const tree = renderer
      .create(<NotificationDeleteButton notification={notification} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
