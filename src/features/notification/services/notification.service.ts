import { v4 as uuidv4 } from "uuid";
import Notification from "../classes/notification.class";
import DataSynchronizerService from "../../../services/applicationData/data-synchronizer.service";

type StateActions = {
  saveNotification: (notification: Notification) => any;
  deleteNotification: (notification: Notification) => any;
  clearNotifications: () => any;
};

export default class NotificationService {
  private readonly notifications: Notification[];

  private readonly dataSynchronizerService: DataSynchronizerService;

  private readonly stateActions: StateActions;

  constructor(
    notifications: Notification[],
    dataSynchronizerService: DataSynchronizerService,
    stateActions: StateActions
  ) {
    this.notifications = notifications;
    this.dataSynchronizerService = dataSynchronizerService;
    this.stateActions = stateActions;
  }

  getNotifications(): Notification[] {
    return this.notifications;
  }

  createMockNotification(): Notification {
    return this.dataSynchronizerService.attachOwnerUuid(
      new Notification(uuidv4(), {
        message: `Mock notification ---- ${new Date().toString()}`,
      }).clone({
        createdAt: new Date().toString(),
      })
    );
  }

  saveNotification(notification: Notification): Promise<any> {
    return this.dataSynchronizerService.saveEntity(
      notification,
      this.stateActions.saveNotification
    );
  }

  deleteNotification(notification: Notification): Promise<any> {
    return this.dataSynchronizerService.deleteEntity(
      notification,
      this.stateActions.deleteNotification
    );
  }

  clearNotifications(): Promise<any> {
    return this.dataSynchronizerService.deleteEntityCollection(
      this.notifications,
      () => {
        this.stateActions.clearNotifications();
      }
    );
  }

  getUnreadNotifications(): Notification[] {
    return this.notifications.filter((n) => !n.read);
  }
}
