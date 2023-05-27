import React, { useContext } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Notification from "../../classes/notification.class";
import {
  ExpirationNoticeLeftIcon,
  NotificationContainer,
  NotificationDatetime,
  NotificationMessage,
  NotificationMessageContainer,
  UnreadNotificationContainer,
} from "./product-expiration-notice.styles";
import NotificationDeleteButton from "../notification-delete-button.component";
import { DependencyInjectionContext } from "../../../../services/dependencyInjection/dependency-injection.context";

const styles = StyleSheet.create({
  rightIcon: {
    color: "rgba(128,128,128,1)",
    fontSize: 20,
    margin: 5,
  },
  actionButtonsContainer: {
    backgroundColor: "white",
    alignSelf: "stretch",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    height: 40,
  },
  leftActionContainer: {
    borderWidth: 1,
    borderColor: "#000000",
    alignSelf: "stretch",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  leftAction: {
    color: "rgba(126,211,33,1)",
    fontSize: 20,
  },
  rightActionContainer: {
    flex: 1,
    alignSelf: "stretch",
    borderWidth: 1,
    borderColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  rightAction: {
    color: "rgba(208,2,27,1)",
    fontSize: 20,
  },
});

export default function GroupInviteNotificationComponent({
  notification,
}: {
  notification: Notification;
}) {
  const {
    navigationService,
    notificationService,
    groupService,
    snackBarService,
  } = useContext(DependencyInjectionContext);
  const {
    data: { groupName, userInGroupUuid, accepted },
    createdAt,
  } = notification;

  const getDatetimeString = () =>
    new Date(createdAt).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    });

  const Container = notification.read
    ? NotificationContainer
    : UnreadNotificationContainer;

  const toggleRead = () => {
    notificationService.saveNotification(
      notification.clone({
        read: !notification.read,
      })
    );
  };

  const getMessage = () => `You were invite to the group '${groupName}'.`;

  const acceptInvite = () => {
    groupService.answerInvite(userInGroupUuid, true).then(() => {
      notificationService
        .saveNotification(
          notification.clone({
            read: true,
            data: {
              groupName,
              userInGroupUuid,
              accepted: true,
            },
          })
        )
        .then(() => {
          navigationService.showGroupsScreen();
          snackBarService.groupInviteAcceptedInfo(groupName);
        });
    });
  };
  const rejectInvite = () => {
    groupService.answerInvite(userInGroupUuid, false).then(() => {
      notificationService
        .saveNotification(
          notification.clone({
            read: true,
            data: {
              groupName,
              userInGroupUuid,
              accepted: false,
            },
          })
        )
        .then(() => {
          snackBarService.groupInviteRejectedInfo(groupName);
        });
    });
  };

  // todo the reading behavior is repeated. make isolate it to component.
  return (
    <Container onPress={toggleRead}>
      <ExpirationNoticeLeftIcon />
      <NotificationMessageContainer>
        <NotificationMessage>{getMessage()}</NotificationMessage>
        {typeof accepted === "undefined" && (
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={styles.leftActionContainer}
              onPress={acceptInvite}
            >
              <MaterialCommunityIcons name="check" style={styles.leftAction} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.rightActionContainer}
              onPress={rejectInvite}
            >
              <MaterialCommunityIcons
                name="block-helper"
                style={styles.rightAction}
              />
            </TouchableOpacity>
          </View>
        )}
        {typeof accepted !== "undefined" && (
          <NotificationMessage>
            {`You ${accepted ? "accepted" : "rejected"} the invite.`}
          </NotificationMessage>
        )}
        <NotificationDatetime>{getDatetimeString()}</NotificationDatetime>
      </NotificationMessageContainer>
      <NotificationDeleteButton notification={notification} />
    </Container>
  );
}
