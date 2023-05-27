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

function HeaderRightActions() {
  const navigation = useNavigation();

  const { user } = useContext(AuthenticationContext);
  const { notificationService } = useContext(DependencyInjectionContext);

  const [unreadNotificationsCount, setUnreadNotificationCount] = useState(
    notificationService.getUnreadNotifications().length
  );

  useEffect(() => {
    setUnreadNotificationCount(
      notificationService.getUnreadNotifications().length
    );
  }, [notificationService]);

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
