import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { HelperText, Switch, TextInput } from "react-native-paper";
import { TimePickerModal } from "react-native-paper-dates";
import { useFonts } from "expo-font";
import materialCommunityIconsFont from "react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf";

function ConfigurationScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [daysBeforeExpiring, setDaysBeforeExpiring] = useState(3);
  const [notificationTime, setNotificationTime] = useState(
    ((d: Date) => `${d.getHours()}:${d.getMinutes()}`)(new Date())
  );
  const [visible, setVisible] = useState(false);
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
    </View>
  );
}

export default ConfigurationScreen;
