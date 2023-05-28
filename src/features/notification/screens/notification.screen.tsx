import React, { useContext, useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { Button } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Notification from "../classes/notification.class";
import NotificationRenderer from "../components/notification-renderer.component";
import { DependencyInjectionContext } from "../../../services/dependencyInjection/dependency-injection.context";
import { DialogModalContext } from "../../../services/modal/dialog-modal.context";
import ConfirmDialog from "../../../components/dialogs/confirm-dialog.component";

function NotificationScreen() {
  const { showModal, hideModal } = useContext(DialogModalContext);
  const { notificationService, snackBarService } = useContext(
    DependencyInjectionContext
  );
  const [notifications, setNotifications] = useState(
    notificationService.getNotifications()
  );

  useEffect(() => {
    setNotifications(notificationService.getNotifications());
  }, [notificationService]);

  const renderItem = ({ item }: { item: Notification }) => (
    <NotificationRenderer notification={item} />
  );

  const handleClearNotifications = () => {
    notificationService.clearNotifications().then(() => {
      snackBarService.showNotificationsClearedInfo();
    });
    hideModal();
  };

  const showConfirmClearNotificationsModal = () => {
    showModal(
      <ConfirmDialog
        confirm="Clear"
        cancel="Cancel"
        dialogContent="Do you want to delete all notifications"
        dialogTitle="Clear Notifications"
        cancelHandler={hideModal}
        confirmHandler={handleClearNotifications}
      />
    );
  };

  const readAll = () => {
    notificationService.markAllAsRead().then(() => {});
  };
  const unreadAll = () => {
    notificationService.markAllAsUnread().then(() => {});
  };

  const debugMode = false;

  return (
    <View>
      <TouchableOpacity onPress={showConfirmClearNotificationsModal}>
        <Button mode="contained">
          <MaterialCommunityIcons name="broom" size={20} color="black" />
          Clear Notifications
        </Button>
      </TouchableOpacity>
      <TouchableOpacity onPress={readAll}>
        <Button mode="contained">
          <MaterialCommunityIcons
            name="email-open-outline"
            size={20}
            color="black"
          />
          {" Mark All as Read"}
        </Button>
      </TouchableOpacity>
      <TouchableOpacity onPress={unreadAll}>
        <Button mode="contained">
          <MaterialCommunityIcons
            name="email-outline"
            size={20}
            color="black"
          />
          {" Mark All as Unread"}
        </Button>
      </TouchableOpacity>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(n) => n.getKey()}
      />
      {debugMode && (
        <Button
          mode="outlined"
          onPress={() => {
            notificationService
              .saveNotification(
                notificationService.createMockNotification("this is a mock!")
              )
              .then(() => {});
          }}
        >
          Debug: add mock notification
        </Button>
      )}
    </View>
  );
}

export default NotificationScreen;
