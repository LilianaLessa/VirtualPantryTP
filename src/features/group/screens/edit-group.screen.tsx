import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { Button, HelperText, TextInput } from "react-native-paper";
import Group from "../classes/group.class";
import { DependencyInjectionContext } from "../../../services/dependencyInjection/dependency-injection.context";
import UserListItem from "../components/user-list-item.component";
import AddUserInput from "../components/add-user-input.component";

export type EditGroupScreenParams = {
  EditGroup: {
    group: Group;
  };
};

type Props = RouteProp<EditGroupScreenParams, "EditGroup">;
export default function EditGroupScreen({
  route: {
    params: { group },
  },
}: {
  route: Props;
}) {
  const { groupService, navigationService, snackBarService } = useContext(
    DependencyInjectionContext
  );
  const [updatedGroup, setUpdateGroup] = useState(group.clone());

  const handleSave = () => {
    groupService.saveGroup(updatedGroup, () => {
      navigationService.showGroupsScreen();
      snackBarService.showGroupSavedInfo(updatedGroup);
    });
  };

  return (
    <View>
      <TextInput
        mode="outlined"
        label="Group name"
        placeholder="Ex.: My Group"
        value={updatedGroup.name}
        onChangeText={(text) =>
          setUpdateGroup(updatedGroup.clone({ name: text }))
        }
        style={{ width: "100%" }}
      />
      <HelperText visible type="info" padding="none">
        Type a name for your group
      </HelperText>

      <AddUserInput
        addUserCallback={(newUserEmail) => {
          // console.log("add user callback", groupService, updatedGroup);
          groupService.setUser(updatedGroup, newUserEmail, false, false);
          setUpdateGroup(updatedGroup.clone());
        }}
      />

      <FlatList
        data={updatedGroup.users}
        renderItem={({ item }) => <UserListItem userInGroup={item} />}
        keyExtractor={(u) => u.getKey()}
      />
      <TouchableOpacity onPress={handleSave}>
        <Button mode="contained">Save</Button>
      </TouchableOpacity>

      <Text>{`Owner UID: ${group.ownerUid}`}</Text>
    </View>
  );
}
