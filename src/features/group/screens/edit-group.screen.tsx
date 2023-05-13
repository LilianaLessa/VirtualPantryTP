import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { Button, HelperText, TextInput } from "react-native-paper";
import Group from "../classes/group.class";
import { DependencyInjectionContext } from "../../../services/dependencyInjection/dependency-injection.context";

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
  const { groupService } = useContext(DependencyInjectionContext);
  const [name, setName] = useState(group.name);

  const handleSave = () => {
    groupService.saveGroup(group, { name }, () => {
      console.log("navigate back after successful save.");
    });
  };
  return (
    <View>
      <TextInput
        mode="outlined"
        label="Group name"
        placeholder="Ex.: My Group"
        value={name}
        onChangeText={(text) => setName(text)}
        style={{ width: "100%" }}
      />
      <HelperText visible type="info" padding="none">
        Type a name for your group
      </HelperText>
      <TouchableOpacity onPress={handleSave}>
        <Button mode="contained">Save</Button>
      </TouchableOpacity>

      <Text>{`Owner UID: ${group.ownerUid}`}</Text>
    </View>
  );
}
