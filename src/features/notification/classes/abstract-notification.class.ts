import { INotification } from "../interfaces/notification.interface";

export default abstract class AbstractNotification implements INotification {
  uuid: string;

  datetime: Date;

  read: boolean;

  constructor(uuid: string, datetime: Date, read: boolean) {
    this.uuid = uuid;
    this.datetime = datetime;
    this.read = read;
  }

  getKey(): string {
    return `notification_${this.uuid}`;
  }

  abstract getComponent(): JSX.Element;
}
