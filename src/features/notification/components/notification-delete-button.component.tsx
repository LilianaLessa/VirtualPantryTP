import React from "react";
import { TouchableOpacity } from "react-native";
import { INotification } from "../interfaces/notification.interface";
import { useActions } from "../../../hooks/useActions";
import NotificationDeleteButtonIcon from "./notification-delete-button.styles";

export default function NotificationDeleteButton({
  notification,
}: {
  notification: INotification;
}) {
  const { deleteNotification } = useActions();
  const handleSelfDelete = () => {
    deleteNotification(notification);
  };

  return (
    <TouchableOpacity onPress={handleSelfDelete}>
      <NotificationDeleteButtonIcon />
    </TouchableOpacity>
  );
}
