import { v4 as uuidv4 } from "uuid";
import { getStackTraceAsString } from "../../../dev-utils";

type StateActions = {
  // saveNotification: (notification: BaseNotification) => any;
  // deleteNotification: (notification: BaseNotification) => any;
  // readNotification: (notification: BaseNotification) => any;
  // clearNotifications: () => any;
};

export default class NotificationService {
  private readonly notifications: BaseNotification[];

  private readonly stateActions: StateActions;

  constructor(notifications: BaseNotification[], stateActions: StateActions) {
    this.notifications = notifications;
    this.stateActions = stateActions;
  }

  getNotifications(): BaseNotification[] {
    return this.notifications;
  }

  createMockNotification(): BaseNotification {
    return BaseNotification.createMockNotification(uuidv4());
  }

  saveNotification(notification: BaseNotification): Promise<any> {
    return Promise.all([])
      .then(() => {
        this.stateActions.saveNotification(notification);
      })
      .catch((e) => {
        console.log(getStackTraceAsString(e));
      });
  }

  clearNotifications(): Promise<any> {
    return Promise.all([]).then(() => {
      this.stateActions.clearNotifications();
    });
  }

  getUnreadNotifications(): BaseNotification[] {
    return this.notifications.filter((n) => !n.read);
  }
}
