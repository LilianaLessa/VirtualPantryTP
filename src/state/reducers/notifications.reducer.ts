import { INotification } from "../../features/notification/interfaces/notification.interface";
import { createMockNotification } from "../../dev-utils";
import { NotificationsActions } from "../actions";
import { NotificationsActionType } from "../action-types";

interface NotificationsState {
  notifications: Map<string, INotification>;
}

const mockNotifications = new Map<string, INotification>();

for (let i = 0; i < 5; i++) {
  const notification = createMockNotification();
  mockNotifications.set(notification.uuid, notification);
}

const initialState: NotificationsState = {
  notifications: mockNotifications,
};

const notificationsReducer = (
  // eslint-disable-next-line default-param-last
  state: NotificationsState = initialState,
  // eslint-disable-next-line comma-dangle
  action: NotificationsActions
): NotificationsState => {
  switch (action.type) {
    case NotificationsActionType.ADD_NOTIFICATION:
      state.notifications.set(
        action.newNotification.uuid,
        // eslint-disable-next-line comma-dangle
        action.newNotification
      );
      return { ...state, notifications: new Map(state.notifications) };
    case NotificationsActionType.REMOVE_NOTIFICATION:
      state.notifications.delete(action.notificationToRemove.uuid);
      return { ...state, notifications: new Map(state.notifications) };
    case NotificationsActionType.READ_NOTIFICATION:
      state.notifications.set(action.notificationToRead.uuid, {
        ...action.notificationToRead,
        read: true,
      });
      return { ...state, notifications: new Map(state.notifications) };
    default:
      return state;
  }
};

export default notificationsReducer;
