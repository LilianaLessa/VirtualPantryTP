type MessageNotificationData = {
  message: string;
};

type NotificationData = MessageNotificationData;

export enum NotificationType {
  MESSAGE,
}
export default class Notification {
  uuid: string;

  data: NotificationData;

  type: NotificationType;

  constructor(
    uuid: string,
    data: NotificationData = { message: `notification ${uuid}` },
    type: NotificationType = NotificationType.MESSAGE
  ) {
    this.uuid = uuid;
    this.data = data;
    this.type = type;
  }

  getKey() {
    return `notification_${this.uuid}`;
  }

  get serialized(): string {
    return JSON.stringify(this.data);
  }

  set serialized(value: string) {
    this.data = JSON.parse(value);
  }
}
