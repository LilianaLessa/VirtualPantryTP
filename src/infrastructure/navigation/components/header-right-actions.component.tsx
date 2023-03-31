import React from "react";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function HeaderRightActions() {
  const navigation = useNavigation();

  return (
    <View>
      <TouchableOpacity
        onPress={() => navigation.navigate("NotificationsScreen" as never)}
      >
        <MaterialCommunityIcons name="bell" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
}

export default HeaderRightActions;
