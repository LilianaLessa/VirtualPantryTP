import React from "react";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
// eslint-disable-next-line import/no-extraneous-dependencies
import { HeaderBackButton } from "@react-navigation/elements";

function HeaderLeftActions() {
  const navigation = useNavigation();

  return (
    <View style={{ flexDirection: "row" }}>
      <TouchableOpacity
        onPress={() => navigation.navigate("ConfigurationsScreen" as never)}
      >
        <MaterialCommunityIcons name="menu" size={24} color="black" />
      </TouchableOpacity>
      {navigation.canGoBack() && (
        <HeaderBackButton
          onPress={() => {
            navigation.goBack();
          }}
        />
      )}
    </View>
  );
}

export default HeaderLeftActions;
