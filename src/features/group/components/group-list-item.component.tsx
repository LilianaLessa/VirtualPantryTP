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
import ConfirmDialog from "../../../components/dialogs/confirm-dialog.component";
import { DialogModalContext } from "../../../services/modal/dialog-modal.context";

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
  const { navigationService, groupService, snackBarService } = useContext(
    DependencyInjectionContext
  );
  const { showModal, hideModal } = useContext(DialogModalContext);

  const handleEdit = () => {
    // if (groupService.isGroupOwnedByLoggedUser(group)) {
    navigationService.showGroupEditScreen(group);
    // }
  };

  const handleSelfDelete = () => {
    hideModal();
    groupService.deleteGroup(group, () => {
      snackBarService.showGroupDeletedInfo(group);
    });
  };

  const handleSelfLeave = () => {
    hideModal();
    groupService.leaveGroup(group, () => {
      snackBarService.showLeftGroupInfo(group);
    });
  };

  const showConfirmDeletionModal = () => {
    showModal(
      <ConfirmDialog
        confirm="Remove"
        cancel="Cancel"
        dialogContent={`Do you want to delete the group '${group.name}'?`}
        dialogTitle="Remove Group"
        cancelHandler={hideModal}
        confirmHandler={handleSelfDelete}
      />
    );
  };
  const showConfirmLeaveModal = () => {
    showModal(
      <ConfirmDialog
        confirm="Leave"
        cancel="Cancel"
        dialogContent={`Do you want to Leave the group '${group.name}'?`}
        dialogTitle="Leave Group"
        cancelHandler={hideModal}
        confirmHandler={handleSelfLeave}
      />
    );
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
            {!groupService.isGroupOwnedByLoggedUser(group) && (
              <TouchableOpacity onPress={showConfirmLeaveModal}>
                <LeaveGroupIcon />
              </TouchableOpacity>
            )}
            {groupService.isGroupOwnedByLoggedUser(group) && (
              <TouchableOpacity onPress={showConfirmDeletionModal}>
                <DeleteIcon />
              </TouchableOpacity>
            )}

            <DragHandler />
          </RightContent>
        </ProductListItemContainer>
      </TouchableOpacity>
    </View>
  );
}

export default GroupListItem;
