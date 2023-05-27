import { Text, View } from "react-native";
import React from "react";
import Notification from "../../classes/notification.class";
import {
  ExpirationNoticeLeftIcon,
  NotificationContainer,
  NotificationDatetime,
  NotificationMessage,
  NotificationMessageContainer,
} from "../product-expiration-notice.styles";
import NotificationDeleteButton from "../notification-delete-button.component";

export default function MessageNotificationComponent({
  notification,
}: {
  notification: Notification;
}) {
  const {
    data: { message },
    createdAt,
  } = notification;

  const getDatetimeString = () =>
    new Date(createdAt).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    });

  return (
    <NotificationContainer>
      <ExpirationNoticeLeftIcon />
      <NotificationMessageContainer>
        <NotificationMessage>{message}</NotificationMessage>
        <NotificationDatetime>{getDatetimeString()}</NotificationDatetime>
      </NotificationMessageContainer>
      <NotificationDeleteButton notification={notification} />
    </NotificationContainer>
  );
}
