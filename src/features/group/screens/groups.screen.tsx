import React, { useContext, useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { v4 as uuidv4 } from "uuid";
import { AuthenticationContext } from "../../../services/firebase/authentication.context";
import { AccountScreenRouteName } from "../../../infrastructure/navigation/route-names";
import Group from "../classes/group.class";
import GroupListItem from "../components/group-list-item.component";

function GroupsScreen() {
  const { user } = useContext(AuthenticationContext);
  const navigation = useNavigation();

  const [currentGroups, setCurrentGroups] = useState<Group[]>();

  useEffect(() => {
    if (user !== null && typeof user !== "undefined") {
      const mockGroups = [
        new Group(uuidv4(), "group 1", user.uid),
        new Group(uuidv4(), "group 2", user.uid),
        new Group(uuidv4(), "group 3", user.uid),
      ];
      setCurrentGroups(mockGroups);
    }
  }, []); // relying on user here to trigger this effect will make the touchable opacity on list item stop working..

  const renderItem = ({ item }: { item: Group }) => (
    <GroupListItem group={item} />
  );

  const keyExtractor = (item: Group) => item.getKey();

  const handleAddGroup = () => {
    console.log("todo");
  };

  if (user !== null) {
    return (
      <View>
        <TouchableOpacity onPress={handleAddGroup}>
          <Button mode="contained">AddGroup</Button>
        </TouchableOpacity>
        <FlatList
          data={currentGroups}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
        />
      </View>
    );
  }

  return (
    <View>
      <Text>To use this feature, please log in.</Text>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(AccountScreenRouteName as never);
        }}
      >
        <Button mode="contained">Go to Account Screen</Button>
      </TouchableOpacity>
    </View>
  );
}

export default GroupsScreen;
