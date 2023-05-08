import React, { useContext, useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { Button } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { INotification } from "../interfaces/notification.interface";
import { useTypedSelector } from "../../../hooks/useTypedSelector";
import Notification from "../components/notification.component";
import { useActions } from "../../../hooks/useActions";
import ConfirmDialog from "../../../components/dialogs/confirm-dialog.component";
import { DialogModalContext } from "../../../services/modal/dialog-modal.context";

function NotificationScreen(): JSX.Element {
  const { notifications } = useTypedSelector((state) => state.notifications);
  const [notificationList, setNotificationList] = useState(
    Array.from(notifications.values())
  );
  const { showModal, hideModal } = useContext(DialogModalContext);
  const { clearNotifications } = useActions();

  useEffect(
    () => setNotificationList(Array.from(notifications.values())),
    [notifications]
  );

  const renderItem = ({ item }: { item: INotification }) => (
    <Notification notification={item} />
  );

  const handleClearNotifications = () => {
    clearNotifications();
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

  return (
    <View>
      <TouchableOpacity onPress={showConfirmClearNotificationsModal}>
        <Button mode="contained">
          <MaterialCommunityIcons name="broom" size={24} color="black" />
          Clear Notifications
        </Button>
      </TouchableOpacity>
      <FlatList
        data={notificationList}
        renderItem={renderItem}
        keyExtractor={(n: INotification) => n.getKey()}
      />
    </View>
  );
}

export default NotificationScreen;
