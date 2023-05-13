import React, { useContext, useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import {
  AccountScreenRouteName,
  EditGroupScreenRouteName,
} from "../../../infrastructure/navigation/route-names";
import Group from "../classes/group.class";
import GroupListItem from "../components/group-list-item.component";
import { DependencyInjectionContext } from "../../../services/dependencyInjection/dependency-injection.context";

function GroupsScreen() {
  const navigation = useNavigation();
  const { groupService, authGuardService } = useContext(
    DependencyInjectionContext
  );

  const [currentGroups, setCurrentGroups] = useState(
    groupService.getGroupsForCurrentUser()
  );

  useEffect(() => {
    setCurrentGroups(groupService.getGroupsForCurrentUser());
    // console.log("user changed on group screen", user?.uid);

    // relying on user here to trigger this effect will make
    // the touchable opacity on list item stop working.
  }, [authGuardService]);

  const renderItem = ({ item }: { item: Group }) => (
    <GroupListItem group={item} />
  );

  const keyExtractor = (item: Group) => item.getKey();

  const handleAddGroup = () => {
    navigation.navigate(
      EditGroupScreenRouteName as never,
      {
        group: groupService.createNewGroup(),
      } as never
    );
  };

  // console.log("group screen redraw", new Date());
  return authGuardService.guard(
    () => (
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
    ),
    () => (
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
    )
  );
}

export default GroupsScreen;
