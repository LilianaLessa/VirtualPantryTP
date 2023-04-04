import React, { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View, Platform } from "react-native";
import { Button, HelperText, Switch, TextInput } from "react-native-paper";
import { TimePickerModal } from "react-native-paper-dates";
import { useFonts } from "expo-font";
import materialCommunityIconsFont from "react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { AndroidNotificationPriority } from "expo-notifications/src/Notifications.types";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    priority: AndroidNotificationPriority.MAX,
  }),
});

// Can use this function below OR use Expo's Push Notification Tool from: https://expo.dev/notifications
async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "Original Title",
    body: "And here is the body!",
    data: { someData: "goes here" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

function ConfigurationScreen() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const [notificationsEnabled, setNotificationsEnabled] = React.useState(false);
  const [daysBeforeExpiring, setDaysBeforeExpiring] = React.useState(3);

  const [notificationTime, setNotificationTime] = React.useState(
    ((d: Date) => `${d.getHours()}:${d.getMinutes()}`)(new Date())
  );
  const [visible, setVisible] = React.useState(false);
  const onDismiss = React.useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const openTimePicker = () => {
    setVisible(true);
  };

  const onConfirm = React.useCallback(
    ({ hours, minutes }: { hours: number; minutes: number }) => {
      setVisible(false);
      setNotificationTime(`${hours}:${minutes}`);
    },
    [setVisible]
  );

  const [materialCommunityIconsFontLoaded] = useFonts({
    MaterialCommunityIcons: materialCommunityIconsFont,
  });

  if (!materialCommunityIconsFontLoaded) {
    return null;
  }

  const testNotification = () => {};

  const onToggleSwitch = () => setNotificationsEnabled(!notificationsEnabled);

  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Switch value={notificationsEnabled} onValueChange={onToggleSwitch} />
        <Text>Activate product expiring date notifications</Text>
      </View>
      <TouchableOpacity onPress={openTimePicker}>
        <TextInput
          mode="outlined"
          label="Notification time"
          placeholder="Ex.: 13:00"
          value={notificationTime}
          style={{ width: "100%" }}
          editable={false}
        />
      </TouchableOpacity>
      <HelperText visible type="info" padding="none">
        Define the time to send notifications about product expiring date
      </HelperText>
      <TextInput
        mode="outlined"
        label="Days before expiration"
        placeholder="Ex.: 3"
        value={daysBeforeExpiring.toString()}
        onChangeText={(text) =>
          setDaysBeforeExpiring(text as unknown as number)
        }
        keyboardType="numeric"
        style={{ width: "100%" }}
      />
      <HelperText visible type="info" padding="none">
        Define how many days before the expiration date the notifications should
        start.
      </HelperText>
      <TimePickerModal
        visible={visible}
        onDismiss={onDismiss}
        onConfirm={onConfirm}
        hours={new Date(`1970-01-01T${notificationTime}Z`).getHours()}
        minutes={new Date(`1970-01-01T${notificationTime}Z`).getMinutes()}
      />
      <Text>
        Your expo push token:
        {expoPushToken}
      </Text>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Text>
          Title:
          {notification && notification.request.content.title}
        </Text>
        <Text>
          Body:
          {notification && notification.request.content.body}
        </Text>
        <Text>
          Data:
          {notification && JSON.stringify(notification.request.content.data)}
        </Text>
      </View>
      <Button
        mode="contained"
        onPress={async () => {
          await sendPushNotification(expoPushToken);
        }}
      >
        test
      </Button>
    </View>
  );
}

export default ConfigurationScreen;
