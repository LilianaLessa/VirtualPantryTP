import Notification from "./notification.class";

export default class MockNotification extends Notification {
  constructor(uuid: string, message = "I'm a mock notification") {
    super(uuid, {
      message,
    });
  }
}
