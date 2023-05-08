import React from "react";
import { View, Text } from "react-native";
import { INotification } from "../interfaces/notification.interface";
import ProductExpirationNoticeNotification from "../classes/product-expiration-notice-notification.class";
import ProductExpirationNotice from "./product-expiration-notice.component";

export default function Notification({
  notification,
}: {
  notification: INotification;
}) {
  switch (notification.constructor.name) {
    case ProductExpirationNoticeNotification.name:
      return (
        <ProductExpirationNotice
          productExpirationNoticeNotification={
            notification as ProductExpirationNoticeNotification
          }
        />
      );
    default:
      return (
        <View>
          <Text>{`${notification.constructor.name}<${notification.uuid}>`}</Text>
        </View>
      );
  }
}
