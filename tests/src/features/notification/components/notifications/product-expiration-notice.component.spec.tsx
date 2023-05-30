import * as React from "react";
import * as renderer from "react-test-renderer";
import { createMockNotification } from "../../../../../../src/dev-utils";
import ProductExpirationNotice from "../../../../../../src/features/notification/components/notifications/product-expiration-notice.component";

describe("App", () => {
  it("snapshot test", () => {
    const notification = createMockNotification();

    const tree = renderer
      .create(<ProductExpirationNotice notification={notification} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
