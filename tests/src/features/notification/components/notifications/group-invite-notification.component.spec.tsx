import * as React from "react";
import * as renderer from "react-test-renderer";
import GroupInviteNotificationComponent from "../../../../../../src/features/notification/components/notifications/group-invite-notification.component";
import { createMockNotification } from "../../../../../../src/dev-utils";

describe("App", () => {
  it("snapshot test", () => {
    const notification = createMockNotification();

    const tree = renderer
      .create(<GroupInviteNotificationComponent notification={notification} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
