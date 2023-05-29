import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Switch } from "react-native-paper";
import UserInGroup from "../classes/user-in-group.class";
import { DependencyInjectionContext } from "../../../services/dependencyInjection/dependency-injection.context";
import Group from "../classes/group.class";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E6E6E6",
    borderWidth: 1,
    borderColor: "#000000",
  },
  labelContainer: {
    backgroundColor: "#E6E6E6",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  label: {
    height: 35,
    alignSelf: "stretch",
    margin: 0,
    flex: 1,
    marginRight: 5,
  },
  icon: {
    color: "rgba(128,128,128,1)",
    fontSize: 30,
    margin: 0,
    marginRight: 5,
  },
  switchesContainer: {
    backgroundColor: "#E6E6E6",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
    margin: 0,
    marginLeft: 5,
    marginBottom: 5,
  },
  switchContainer: {
    backgroundColor: "#E6E6E6",
    flexDirection: "row",
    alignSelf: "stretch",
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  switch: {
    width: 45,
    height: 23,
  },
  switchLabel: {
    color: "#121212",
  },
});

export default function UserListItem({
  group,
  userInGroup,
  deleteUserInGroupCallback,
}: {
  group: Group;
  userInGroup: UserInGroup;
  deleteUserInGroupCallback: (userInGroupToDelete: UserInGroup) => void;
}) {
  const { groupService } = useContext(DependencyInjectionContext);

  const [groupPermission, setGroupPermission] = useState(
    groupService.getCurrentUserPermissions(group)
  );

  useEffect(() => {
    setGroupPermission(groupService.getCurrentUserPermissions(group));
  }, [groupService, group]);

  const [isAdmin, setIsAdmin] = useState(userInGroup.isAdmin);
  const [isInviter, setIsInviter] = useState(userInGroup.isInviter);
  // const { groupService } = useContext(DependencyInjectionContext);

  useEffect(() => {
    userInGroup.isAdmin = isAdmin;
    userInGroup.isInviter = isInviter;
  }, [isAdmin, isInviter]);

  const handleSelfDelete = () => {
    deleteUserInGroupCallback(userInGroup);
  };

  let editablePermissions = false;
  if (
    (groupPermission.isAdmin &&
      typeof userInGroup.answererUid === "undefined") ||
    (groupPermission.isOwner && userInGroup.answererUid !== group.ownerUid) ||
    (groupPermission.isAdmin &&
      userInGroup.answererUid &&
      userInGroup.answererUid !== group.ownerUid)
  ) {
    editablePermissions = true;
  }

  // console.log(userInGroup.email, editablePermissions, groupPermission);

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <MaterialCommunityIcons
          style={styles.icon}
          name="account"
          size={24}
          color="black"
        />
        <Text style={styles.label}>{userInGroup.email}</Text>
        {editablePermissions && (
          <TouchableOpacity onPress={handleSelfDelete}>
            <MaterialCommunityIcons
              style={styles.icon}
              name="trash-can"
              size={24}
              color="black"
            />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.switchesContainer}>
        <View style={styles.switchContainer}>
          <Switch
            disabled={!editablePermissions}
            style={styles.switch}
            value={isAdmin}
            onValueChange={() => setIsAdmin(!isAdmin)}
          />
          <Text style={styles.switchLabel}>Administrator</Text>
        </View>
        <View style={styles.switchContainer}>
          <Switch
            disabled={!editablePermissions}
            style={styles.switch}
            value={isInviter}
            onValueChange={() => setIsInviter(!isInviter)}
          />
          <Text style={styles.switchLabel}>Inviter</Text>
        </View>
      </View>
    </View>
  );
}
