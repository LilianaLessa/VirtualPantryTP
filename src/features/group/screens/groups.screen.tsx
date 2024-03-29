import React, { useContext, useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { Button } from "react-native-paper";
import Group from "../classes/group.class";
import GroupListItem from "../components/group-list-item.component";
import { DependencyInjectionContext } from "../../../services/dependencyInjection/dependency-injection.context";
import { useTypedSelector } from "../../../hooks/useTypedSelector";

function GroupsScreen() {
  const { groups } = useTypedSelector((state) => state.groups);
  const { groupService, authGuardService, navigationService } = useContext(
    DependencyInjectionContext
  );

  const [currentGroups, setCurrentGroups] = useState(
    groupService.getGroupsForCurrentUser()
  );

  useEffect(() => {
    setCurrentGroups(groupService.getGroupsForCurrentUser());
  }, [groups]);

  const renderItem = ({ item }: { item: Group }) => (
    <GroupListItem group={item} />
  );

  const keyExtractor = (item: Group) => item.getKey();

  const handleAddGroup = () => {
    navigationService.showGroupEditScreen(groupService.createNewGroup());
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
        <TouchableOpacity onPress={() => groupService.dropDb()}>
          <Button mode="contained">debug: drop db</Button>
        </TouchableOpacity>
      </View>
    ),
    () => (
      <View>
        <Text>To use this feature, please log in.</Text>
        <TouchableOpacity
          onPress={() => {
            navigationService.showAccountScreen();
          }}
        >
          <Button mode="contained">Go to Account Screen</Button>
        </TouchableOpacity>
      </View>
    )
  );
}

export default GroupsScreen;
