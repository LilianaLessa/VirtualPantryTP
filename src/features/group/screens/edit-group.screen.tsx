import React from "react";
import { View, Text } from "react-native";
import { RouteProp } from "@react-navigation/native";
import GroupService from "../services/group.service";
import Group from "../classes/group.class";

export type EditGroupScreenParams = {
  EditGroup: {
    group: Group;
    groupService: GroupService;
  };
};

type Props = RouteProp<EditGroupScreenParams, "EditGroup">;
export default function EditGroupScreen({
  route: {
    params: { group, groupService },
  },
}: {
  route: Props;
}) {
  console.log(group, groupService);
  return (
    <View>
      <Text>Edit group screen</Text>
    </View>
  );
}
