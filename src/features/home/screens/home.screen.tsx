import { StyleSheet, View } from "react-native";
import React from "react";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const styles = StyleSheet.create({
  leftIcon: {
    color: "rgba(0,0,0,1)",
    fontSize: 20,
    marginLeft: 10,
    margin: 0,
  },
});

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View>
      <Button onPress={() => navigation.navigate("Products")} mode="contained">
        <MaterialCommunityIcons name="food-apple" style={styles.leftIcon} />
        Products
      </Button>
      <Button onPress={() => navigation.navigate("Pantries")} mode="contained">
        <MaterialCommunityIcons name="dropbox" style={styles.leftIcon} />
        Pantries
      </Button>
      <Button
        onPress={() => navigation.navigate("ShoppingLists")}
        mode="contained"
      >
        <MaterialCommunityIcons
          name="format-list-bulleted"
          style={styles.leftIcon}
        />
        Shopping Lists
      </Button>
      <Button onPress={() => navigation.navigate("Groups")} mode="contained">
        <MaterialCommunityIcons name="account-group" style={styles.leftIcon} />
        Groups
      </Button>
    </View>
  );
}

export default HomeScreen;
