import React, { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { v4 as uuidv4 } from "uuid";
import { faker } from "@faker-js/faker";
import { INotification } from "../interfaces/notification.interface";
import ProductExpirationNoticeNotification from "../classes/product-expiration-notice-notification.class";

function NotificationScreen(): JSX.Element {
  const [notifications, setNotifications] = useState<INotification[]>([]);

  useEffect(
    () =>
      setNotifications(
        Array.from(
          { length: 5 },
          () =>
            new ProductExpirationNoticeNotification(
              uuidv4(),
              new Date(),
              false,
              {
                product: {
                  name: faker.word.noun(),
                },
              },
              faker.random.numeric() as unknown as number
            ),
          0
        )
      ),
    []
  );

  return (
    <View>
      <FlatList
        data={notifications}
        renderItem={({ item }: { item: INotification }) => item.getComponent()}
        keyExtractor={(n: INotification) => n.getKey()}
      />
    </View>
  );
}

export default NotificationScreen;
