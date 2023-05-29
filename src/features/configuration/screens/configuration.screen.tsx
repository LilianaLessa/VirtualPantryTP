import React, { useContext, useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Button, HelperText, Switch, TextInput } from "react-native-paper";
import { TimePickerModal } from "react-native-paper-dates";
import { useFonts } from "expo-font";
import materialCommunityIconsFont from "react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf";
import { DependencyInjectionContext } from "../../../services/dependencyInjection/dependency-injection.context";
import { useTypedSelector } from "../../../hooks/useTypedSelector";

function addTrailingZero(value: any) {
  if (value == 0) return "00";
  return Intl.NumberFormat("en-US", {
    minimumIntegerDigits: 2,
  }).format(value);
}

function ConfigurationScreen() {
  const { configuration } = useTypedSelector((state) => state.configuration);
  const { configurationService, snackBarService, navigationService } =
    useContext(DependencyInjectionContext);

  const [currentConfiguration, setCurrentConfiguration] = useState(
    configurationService.getConfiguration() ??
      configurationService.createConfiguration()
  );

  useEffect(() => {
    setCurrentConfiguration(
      configurationService.getConfiguration() ??
        configurationService.createConfiguration()
    );
  }, [configuration, configurationService]);

  const [notificationsEnabled, setNotificationsEnabled] = useState(
    currentConfiguration.data.productExpiringNotification.enabled
  );
  const [daysBeforeExpiring, setDaysBeforeExpiring] = useState(
    currentConfiguration.data.productExpiringNotification.daysBefore
  );
  const [notificationTime, setNotificationTime] = useState(
    `${addTrailingZero(
      currentConfiguration.data.productExpiringNotification.hours
    )}:${addTrailingZero(
      currentConfiguration.data.productExpiringNotification.minutes
    )}`
  );

  useEffect(() => {
    setNotificationsEnabled(
      currentConfiguration.data.productExpiringNotification.enabled
    );
    setDaysBeforeExpiring(
      currentConfiguration.data.productExpiringNotification.daysBefore
    );
    setNotificationTime(
      `${addTrailingZero(
        currentConfiguration.data.productExpiringNotification.hours
      )}:${addTrailingZero(
        currentConfiguration.data.productExpiringNotification.minutes
      )}`
    );
  }, [currentConfiguration]);

  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const onDismiss = React.useCallback(() => {
    setTimePickerVisible(false);
  }, [setTimePickerVisible]);

  const openTimePicker = () => {
    setTimePickerVisible(true);
  };

  const onConfirm = React.useCallback(
    ({ hours, minutes }: { hours: number; minutes: number }) => {
      setTimePickerVisible(false);
      setNotificationTime(
        `${addTrailingZero(hours)}:${addTrailingZero(minutes)}`
      );
    },
    [setTimePickerVisible]
  );

  const [materialCommunityIconsFontLoaded] = useFonts({
    MaterialCommunityIcons: materialCommunityIconsFont,
  });

  if (!materialCommunityIconsFontLoaded) {
    return null;
  }

  const onToggleSwitch = () => setNotificationsEnabled(!notificationsEnabled);

  const saveConfiguration = () => {
    const [h, m] = notificationTime.split(":");
    const productExpiringNotification = {
      enabled: notificationsEnabled,
      daysBefore: daysBeforeExpiring,
      hours: h as unknown as number,
      minutes: m as unknown as number,
    };

    configurationService
      .saveConfiguration(
        currentConfiguration.clone({
          data: {
            productExpiringNotification,
          },
        })
      )
      .then(() => {
        navigationService.goBack();
        snackBarService.showConfigurationSavedInfo();
      })
      .catch((e) => {
        console.log(e);
      });
  };

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
        visible={timePickerVisible}
        onDismiss={onDismiss}
        onConfirm={onConfirm}
        hours={notificationTime.split(":")[0]}
        minutes={notificationTime.split(":")[1]}
      />
      <TouchableOpacity onPress={saveConfiguration}>
        <Button mode="contained">Save</Button>
      </TouchableOpacity>
    </View>
  );
}

export default ConfigurationScreen;
