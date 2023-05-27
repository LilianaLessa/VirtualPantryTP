import { Text, View } from "react-native";
import React from "react";
import Notification from "../../classes/notification.class";

export default function MessageNotificationComponent({
  notification: {
    type,
    data: { message },
    serialized,
  },
}: {
  notification: Notification;
}) {
  return (
    <View>
      <Text>{`type: ${type} message: ${message} serialized: ${serialized}`}</Text>
    </View>
  );
}
