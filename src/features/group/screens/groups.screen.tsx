import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { Button } from "react-native-paper";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { AccountScreenRouteName } from "../../../infrastructure/navigation/route-names";
import Group from "../classes/group.class";
import GroupListItem from "../components/group-list-item.component";
import GroupService from "../services/group.service";
import AuthGuardService from "../../../services/firebase/auth-guard.service";
import NavigationService from "../../../infrastructure/navigation/services/navigation.service";

export type GroupScreenParams = {
  GroupScreen: {
    groupService: GroupService;
    authGuardService: AuthGuardService;
    navigationService: NavigationService;
  };
};
type Props = RouteProp<GroupScreenParams, "GroupScreen">;

function GroupsScreen({
  route: {
    params: { groupService, authGuardService },
  },
}: {
  route: Props;
}) {
  const navigation = useNavigation();

  const [currentGroups, setCurrentGroups] = useState(
    groupService.getGroupsForCurrentUser()
  );

  useEffect(() => {
    setCurrentGroups(groupService.getGroupsForCurrentUser());

    // relying on user here to trigger this effect will make
    // the touchable opacity on list item stop working.
  }, [groupService]);

  const renderItem = ({ item }: { item: Group }) => (
    <GroupListItem group={item} />
  );

  const keyExtractor = (item: Group) => item.getKey();

  const handleAddGroup = () => {
    // navigationService.navigateToGroupEditScreen(groupService.createNewGroup());
  };

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
