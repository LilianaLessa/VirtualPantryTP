import React, { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { INotification } from "../interfaces/notification.interface";
import { useTypedSelector } from "../../../hooks/useTypedSelector";
import Notification from "../components/notification.component";

function NotificationScreen(): JSX.Element {
  const { notifications } = useTypedSelector((state) => state.notifications);
  const [notificationList, setNotificationList] = useState(
    Array.from(notifications.values())
  );

  useEffect(
    () => setNotificationList(Array.from(notifications.values())),
    [notifications]
  );

  const renderItem = ({ item }: { item: INotification }) => (
    <Notification notification={item} />
  );

  return (
    <View>
      <FlatList
        data={notificationList}
        renderItem={renderItem}
        keyExtractor={(n: INotification) => n.getKey()}
      />
    </View>
  );
}

export default NotificationScreen;
