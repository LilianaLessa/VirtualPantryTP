import React, { useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  AccountScreenRouteName,
  NotificationsScreenRouteName,
} from "../route-names";
import { AuthenticationContext } from "../../../services/firebase/authentication.context";

function HeaderRightActions() {
  const navigation = useNavigation();

  const { user } = useContext(AuthenticationContext);

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
        <MaterialCommunityIcons name="bell" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate(AccountScreenRouteName as never)}
      >
        <MaterialCommunityIcons
          name={user ? "account-circle" : "account-circle-outline"}
          size={24}
          color="black"
        />
      </TouchableOpacity>
    </View>
  );
}

export default HeaderRightActions;
