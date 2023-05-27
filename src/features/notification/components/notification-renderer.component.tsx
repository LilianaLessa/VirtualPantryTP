import { Text, View } from "react-native";
import React from "react";
import Notification, { NotificationType } from "../classes/notification.class";
import MessageNotificationComponent from "./notifications/message-notification.component";

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
  let Renderer;
  switch (notification.type) {
    case NotificationType.MESSAGE:
      Renderer = MessageNotificationComponent;
      break;
    default:
      Renderer = NullNotification;
  }

  return <Renderer notification={notification} />;
}
