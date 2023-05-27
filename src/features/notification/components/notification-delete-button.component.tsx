import React, { useContext } from "react";
import { TouchableOpacity } from "react-native";
import NotificationDeleteButtonIcon from "./notification-delete-button.styles";
import Notification from "../classes/notification.class";
import { DependencyInjectionContext } from "../../../services/dependencyInjection/dependency-injection.context";

export default function NotificationDeleteButton({
  notification,
}: {
  notification: Notification;
}) {
  const { notificationService } = useContext(DependencyInjectionContext);
  const handleSelfDelete = () => {
    notificationService.deleteNotification(notification);
  };

  return (
    <TouchableOpacity onPress={handleSelfDelete}>
      <NotificationDeleteButtonIcon />
    </TouchableOpacity>
  );
}
