import React, { useContext } from "react";
import { TouchableOpacity, View } from "react-native";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import styled from "styled-components";
import Group from "../classes/group.class";
import {
  DeleteIcon,
  DragHandler,
  LeftContent,
  LeftText,
  ProductListItemContainer,
  RightContent,
} from "../../products/components/product-list-item.styles";
import { DependencyInjectionContext } from "../../../services/dependencyInjection/dependency-injection.context";

export const GroupLeftIcon = styled(MaterialCommunityIcons).attrs({
  name: "account-group",
})`
  color: rgba(0, 0, 0, 1);
  font-size: 20px;
  margin-left: 10px;
`;
export const LeaveGroupIcon = styled(Entypo).attrs({
  name: "export",
})`
  color: rgba(0, 0, 0, 1);
  font-size: 20px;
  margin-left: 10px;
`;

function GroupListItem({ group }: { group: Group }) {
  const { navigationService } = useContext(DependencyInjectionContext);

  const handleEdit = () => {
    navigationService.showGroupEditScreen(group);
  };
  const showConfirmDeletionModal = () => {
    console.log("showConfirmDeletionModal todo");
  };
  const showConfirmLeaveModal = () => {
    console.log("showConfirmLeaveModal todo");
  };

  // todo show delete group only for creator
  // todo show leave group only for not creator
  return (
    <View>
      <TouchableOpacity onPress={handleEdit}>
        <ProductListItemContainer>
          <LeftContent>
            <GroupLeftIcon />
            <LeftText>{group.name}</LeftText>
          </LeftContent>
          <RightContent>
            <TouchableOpacity onPress={showConfirmLeaveModal}>
              <LeaveGroupIcon />
            </TouchableOpacity>
            <TouchableOpacity onPress={showConfirmDeletionModal}>
              <DeleteIcon />
            </TouchableOpacity>
            <DragHandler />
          </RightContent>
        </ProductListItemContainer>
      </TouchableOpacity>
    </View>
  );
}

export default GroupListItem;
