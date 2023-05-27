import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { Button, HelperText, TextInput } from "react-native-paper";
import Group from "../classes/group.class";
import { DependencyInjectionContext } from "../../../services/dependencyInjection/dependency-injection.context";
import UserListItem from "../components/user-list-item.component";
import AddUserInput from "../components/add-user-input.component";
import UserInGroup, {
  UseInGroupAcceptanceState,
} from "../classes/user-in-group.class";

// todo when rendering this screen, make sure that the logged user is the owner of the group.
//      this will avoid unauthorized group edition.

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
    groupService.saveGroup(group, updatedGroup, () => {
      navigationService.showGroupsScreen();
      snackBarService.showGroupSavedInfo(updatedGroup);
    });
  };

  const handleUserDeletion = (userInGroupToDelete: UserInGroup) => {
    setUpdateGroup(
      updatedGroup.clone({
        users: updatedGroup.users.filter(
          (uig) => uig.uuid !== userInGroupToDelete.uuid
        ),
      })
    );
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
          groupService.setUser(
            updatedGroup,
            newUserEmail,
            false,
            false,
            UseInGroupAcceptanceState.PENDING
          );
          setUpdateGroup(updatedGroup.clone());
        }}
      />

      <FlatList
        data={updatedGroup.users}
        renderItem={({ item }) => (
          <UserListItem
            userInGroup={item}
            deleteUserInGroupCallback={handleUserDeletion}
          />
        )}
        keyExtractor={(u) => u.getKey()}
      />
      <TouchableOpacity onPress={handleSave}>
        <Button mode="contained">Save</Button>
      </TouchableOpacity>

      <Text>{`Owner UID: ${group.ownerUid}`}</Text>
      <Text>{`Firestore DocID: ${group.firestoreId}`}</Text>
    </View>
  );
}
