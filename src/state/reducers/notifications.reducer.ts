import { NotificationsActions } from "../actions";
import { NotificationsActionType } from "../action-types";
import Notification from "../../features/notification/classes/notification.class";

interface NotificationsState {
  notifications: Map<string, Notification>;
}

const initialState: NotificationsState = {
  notifications: new Map<string, Notification>(),
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
        action.notification.uuid,
        // eslint-disable-next-line comma-dangle
        action.notification
      );
      return { ...state, notifications: new Map(state.notifications) };
    case NotificationsActionType.REMOVE_NOTIFICATION:
      state.notifications.delete(action.notification.uuid);
      return { ...state, notifications: new Map(state.notifications) };
    case NotificationsActionType.CLEAR_NOTIFICATIONS:
      state.notifications.clear();
      return { ...state, notifications: new Map(state.notifications) };

    case NotificationsActionType.INIT_NOTIFICATION_COLLECTION:
      return {
        ...state,
        notifications: action.notifications.reduce(
          (map: Map<string, Notification>, p: Notification) =>
            map.set(p.uuid, p),
          new Map<string, Notification>()
        ),
      };
    default:
      return state;
  }
};

export default notificationsReducer;
