import React, { useContext } from "react";
import Notification from "../../classes/notification.class";
import {
  ExpirationNoticeLeftIcon,
  NotificationContainer,
  NotificationDatetime,
  NotificationMessage,
  NotificationMessageContainer,
  UnreadNotificationContainer,
} from "./product-expiration-notice.styles";
import NotificationDeleteButton from "../notification-delete-button.component";
import { DependencyInjectionContext } from "../../../../services/dependencyInjection/dependency-injection.context";

export default function MessageNotificationComponent({
  notification,
}: {
  notification: Notification;
}) {
  const { notificationService } = useContext(DependencyInjectionContext);

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

  const Container = notification.read
    ? NotificationContainer
    : UnreadNotificationContainer;

  const toggleRead = () => {
    notificationService.saveNotification(
      notification.clone({
        read: !notification.read,
      })
    );
  };

  // todo the reading behavior is repeated. make isolate it to component.
  return (
    <Container onPress={toggleRead}>
      <ExpirationNoticeLeftIcon />
      <NotificationMessageContainer>
        <NotificationMessage>{message}</NotificationMessage>
        <NotificationDatetime>{getDatetimeString()}</NotificationDatetime>
      </NotificationMessageContainer>
      <NotificationDeleteButton notification={notification} />
    </Container>
  );
}
