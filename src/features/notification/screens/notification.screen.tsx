import React from "react";
import { FlatList, Text, View } from "react-native";
import Notification from "../classes/notification.class";
import NotificationRenderer from "../components/notification-renderer.component";
import MockNotification from "../classes/mock-notification.class";

function NotificationScreen() {
  const data = [
    new MockNotification("a"),
    new MockNotification("b", "Another mock"),
  ];

  const renderItem = ({ item }: { item: Notification }) => (
    <NotificationRenderer notification={item} />
  );

  return (
    <View>
      <Text> Notification Screen</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(n) => n.getKey()}
      />
    </View>
  );
}

export default NotificationScreen;
