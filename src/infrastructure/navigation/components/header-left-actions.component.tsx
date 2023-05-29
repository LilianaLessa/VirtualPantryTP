import React from "react";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { HeaderBackButton } from "@react-navigation/elements";
import { ConfigurationsScreenRouteName } from "../route-names";

function HeaderLeftActions() {
  const navigation = useNavigation();

  return (
    <View style={{ flexDirection: "row" }}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(ConfigurationsScreenRouteName as never)
        }
      >
        <MaterialCommunityIcons name="menu" size={24} color="black" />
      </TouchableOpacity>
      {navigation.canGoBack() && (
        <HeaderBackButton
          onPress={() => {
            navigation.canGoBack() && navigation.goBack();
          }}
        />
      )}
    </View>
  );
}

export default HeaderLeftActions;
