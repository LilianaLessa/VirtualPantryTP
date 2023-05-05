import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Entypo, FontAwesome, MaterialIcons } from "@expo/vector-icons";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBarPlaceholder: {
    height: 24,
    alignSelf: "stretch",
    marginBottom: 0,
  },
  content: {
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(230, 230, 230,1)",
  },
  notificationList: {
    backgroundColor: "#E6E6E6",
    margin: 10,
    alignSelf: "stretch",
    flex: 1,
  },
  notificationItem: {
    alignSelf: "stretch",
    shadowColor: "rgba(0,0,0,1)",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    elevation: 9,
    shadowOpacity: 1,
    shadowRadius: 3,
  },
  notificationItemWithActions: {
    alignSelf: "stretch",
    marginBottom: 5,
    height: 97,
    marginTop: 5,
    shadowColor: "rgba(0,0,0,1)",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    elevation: 9,
    shadowOpacity: 1,
    shadowRadius: 3,
  },
  notificationItem2: {
    alignSelf: "stretch",
    shadowColor: "rgba(0,0,0,1)",
    shadowOffset: {
      height: 2,
      width: 2,
    },
    elevation: 9,
    shadowOpacity: 1,
    shadowRadius: 3,
  },
});

const itemStyles = StyleSheet.create({
  container: {
    backgroundColor: "#E6E6E6",
    flexDirection: "row",
    padding: 5,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#000000",
  },
  leftIcon: {
    color: "rgba(128,128,128,1)",
    fontSize: 20,
    marginLeft: 0,
    margin: 10,
  },
  messageContainer1: {
    backgroundColor: "#E6E6E6",
    marginLeft: 0,
    margin: 10,
    alignSelf: "stretch",
    flex: 1,
  },
  message: {
    color: "#121212",
    fontSize: 15,
    margin: 0,
    alignSelf: "stretch",
    flex: 1,
  },
  dateTime: {
    color: "rgba(128,128,128,1)",
    fontSize: 10,
    margin: 0,
  },
  rightIcon: {
    color: "rgba(128,128,128,1)",
    fontSize: 20,
    marginLeft: 0,
    margin: 0,
    alignSelf: "flex-start",
  },
});

const itemWithActionsStyles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(230, 230, 230,1)",
    justifyContent: "flex-start",
  },
  notificationContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#000000",
    alignSelf: "flex-start",
  },
  leftIcon: {
    color: "rgba(128,128,128,1)",
    fontSize: 20,
    margin: 5,
    alignSelf: "center",
  },
  messageContainer: {
    backgroundColor: "#E6E6E6",
    alignSelf: "flex-start",
    margin: 5,
    flex: 1,
  },
  message: {
    color: "#121212",
    fontSize: 15,
    marginTop: 5,
    alignSelf: "stretch",
  },
  dateTime: {
    color: "rgba(128,128,128,1)",
    fontSize: 10,
    marginTop: 5,
  },
  rightIcon: {
    color: "rgba(128,128,128,1)",
    fontSize: 20,
    margin: 5,
  },
  actionButtonsContainer: {
    backgroundColor: "#E6E6E6",
    alignSelf: "stretch",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  leftActionContainer: {
    backgroundColor: "#E6E6E6",
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
    backgroundColor: "#E6E6E6",
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

function NotificationItem({
  message,
  dateTime,
}: {
  message: string;
  dateTime: string;
}) {
  return (
    <View style={[itemStyles.container]}>
      <FontAwesome name="warning" style={itemStyles.leftIcon} />
      <View style={itemStyles.messageContainer1}>
        <Text style={itemWithActionsStyles.message}>{message}</Text>
        <Text style={itemWithActionsStyles.dateTime}>{dateTime}</Text>
      </View>
      <Entypo name="dots-three-horizontal" style={itemStyles.rightIcon} />
    </View>
  );
}

function NotificationItemWithActions({
  message,
  dateTime,
}: {
  message: string;
  dateTime: string;
}) {
  return (
    <View style={[itemWithActionsStyles.container]}>
      <View style={itemWithActionsStyles.notificationContainer}>
        <FontAwesome name="users" style={itemWithActionsStyles.leftIcon} />
        <View style={itemWithActionsStyles.messageContainer}>
          <Text style={itemWithActionsStyles.message}>{message}</Text>
          <Text style={itemWithActionsStyles.dateTime}>{dateTime}</Text>
        </View>
        <Entypo
          name="dots-three-horizontal"
          style={itemWithActionsStyles.rightIcon}
        />
      </View>
      <View style={itemWithActionsStyles.actionButtonsContainer}>
        <View style={itemWithActionsStyles.leftActionContainer}>
          <MaterialIcons
            name="check"
            style={itemWithActionsStyles.leftAction}
          />
        </View>
        <View style={itemWithActionsStyles.rightActionContainer}>
          <MaterialIcons
            name="block"
            style={itemWithActionsStyles.rightAction}
          />
        </View>
      </View>
    </View>
  );
}

function NotificationScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.notificationList}>
          <NotificationItem
            message="'Leite' expira em 1 dia."
            dateTime="8 de dez. às 12:30"
          />
          <NotificationItemWithActions
            message="Você recebeu um convite para o grupo 'Família Madrigal'."
            dateTime="8 de dez. às 12:30"
          />
          <NotificationItem
            message="'Leite' expira em 2 dias."
            dateTime="8 de dez. às 12:30"
          />
        </View>
      </View>
    </View>
  );
}

export default NotificationScreen;
