import { v4 as uuidv4 } from "uuid";
import Notification, { NotificationType } from "../classes/notification.class";
import DataSynchronizerService from "../../../services/applicationData/data-synchronizer.service";
import StoredProduct from "../../products/classes/stored.product";
import UserInGroup from "../../group/classes/user-in-group.class";
import Group from "../../group/classes/group.class";

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
    return this.createBaseNotification().clone({
      data: {
        message: `Mock notification ---- ${new Date().toString()}`,
      },
    });
  }

  createExpirationNoticeNotification(
    storedProduct: StoredProduct
  ): Notification {
    const daysUntil = (date1: Date): number => {
      const date2 = new Date();
      const difference = date1.getTime() - date2.getTime();
      return Math.ceil(difference / (1000 * 3600 * 24));
    };

    const remainingDays = daysUntil(new Date(storedProduct.bestBefore));

    return this.createBaseNotification().clone({
      type: NotificationType.PRODUCT_EXPIRATION_NOTICE,
      data: {
        storedProductUuid: storedProduct.uuid,
        remainingDays,
      },
    });
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

  sendGroupInviteNotification(
    userInGroup: UserInGroup,
    group: Group
  ): Promise<any> {
    // check on notifications if there is already an invite to this group.
    const currentInvite = this.notifications.find(
      (n) =>
        n.type === NotificationType.GROUP_INVITE &&
        n.data.userInGroupUuid === userInGroup.uuid
    );
    if (typeof currentInvite === "undefined") {
      const newInvite = this.createBaseNotification().clone({
        type: NotificationType.GROUP_INVITE,
        data: {
          userInGroupUuid: userInGroup.uuid,
          groupName: group.name,
        },
      });

      if (typeof newInvite.ownerUid !== "undefined") {
        return this.saveNotification(newInvite);
      }
    }

    return Promise.resolve();
  }

  private createBaseNotification(): Notification {
    return this.dataSynchronizerService.attachOwnerUuid(
      new Notification(uuidv4()).clone({
        createdAt: new Date().toString(),
      })
    );
  }
}
