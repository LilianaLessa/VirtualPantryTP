import React, { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Badge } from "react-native-paper";
import {
  AccountScreenRouteName,
  NotificationsScreenRouteName,
} from "../route-names";
import { AuthenticationContext } from "../../../services/firebase/authentication.context";
import { DependencyInjectionContext } from "../../../services/dependencyInjection/dependency-injection.context";
import { useTypedSelector } from "../../../hooks/useTypedSelector";

function HeaderRightActions() {
  const navigation = useNavigation();

  const { user } = useContext(AuthenticationContext);
  // const { notificationService } = useContext(DependencyInjectionContext);
  const { notifications } = useTypedSelector((state) => state.notifications);

  const [unreadNotificationsCount, setUnreadNotificationCount] = useState(
    Array.from(notifications.values()).filter((n) => !n.read).length
  );

  useEffect(() => {
    console.log("setting unreadNotificationsCount");
    setUnreadNotificationCount(
      Array.from(notifications.values()).filter((n) => !n.read).length
    );
  }, [notifications]);

  return (
    <View
      style={{
        flexDirection: "row",
      }}
    >
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(NotificationsScreenRouteName as never)
        }
      >
        <MaterialCommunityIcons
          name="bell"
          size={24}
          color={unreadNotificationsCount <= 0 ? "black" : "red"}
        />
        {unreadNotificationsCount > 0 && (
          <Badge>{unreadNotificationsCount}</Badge>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate(AccountScreenRouteName as never)}
      >
        <MaterialCommunityIcons
          name={
            typeof user?.uid !== "undefined"
              ? "account-circle"
              : "account-circle-outline"
          }
          size={24}
          color="black"
        />
      </TouchableOpacity>
    </View>
  );
}

export default HeaderRightActions;
