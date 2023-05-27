import { Text, View } from "react-native";
import React, { useContext } from "react";
import Notification, { NotificationType } from "../classes/notification.class";
import MessageNotificationComponent from "./notifications/message-notification.component";
import ProductExpirationNotice from "./notifications/product-expiration-notice.component";
import {
  NotificationContainer,
  UnreadNotificationContainer,
} from "./notifications/product-expiration-notice.styles";
import { DependencyInjectionContext } from "../../../services/dependencyInjection/dependency-injection.context";

function NullNotification({ notification }: { notification: Notification }) {
  return (
    <View>
      <Text>
        {`Unidentified type of notification: ${JSON.stringify(notification)}`}
      </Text>
    </View>
  );
}

export default function NotificationRenderer({
  notification,
}: {
  notification: Notification;
}) {
  const { notificationService } = useContext(DependencyInjectionContext);

  let Renderer;
  switch (notification.type) {
    case NotificationType.MESSAGE:
      Renderer = MessageNotificationComponent;
      break;
    case NotificationType.PRODUCT_EXPIRATION_NOTICE:
      Renderer = ProductExpirationNotice;
      break;
    default:
      Renderer = NullNotification;
  }

  return <Renderer notification={notification} />;
}
