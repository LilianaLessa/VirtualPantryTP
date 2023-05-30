import * as React from "react";
import * as renderer from "react-test-renderer";
import { createMockNotification } from "../../../../../../src/dev-utils";
import MessageNotificationComponent from "../../../../../../src/features/notification/components/notifications/message-notification.component";

describe("App", () => {
  it("snapshot test", () => {
    const notification = createMockNotification();

    const tree = renderer
      .create(<MessageNotificationComponent notification={notification} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
