import { TouchableOpacity } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styled from "styled-components";
import { IPantry } from "../interfaces/pantry.interface";
import {
  // todo make these more generic
  AddToPantryIcon,
  DeleteIcon,
  DragHandler,
  EditIcon,
  LeftContent,
  LeftText,
  ProductListItemContainer,
  RightContent,
} from "../../products/components/product-list-item.styles";

export const PantryLeftIcon = styled(MaterialCommunityIcons).attrs({
  name: "dropbox",
})`
  color: rgba(0, 0, 0, 1);
  font-size: 20px;
  margin-left: 10px;
`;

function PantryListItem({ item }: { item: IPantry }) {
  const handleEdit = () => {};
  const showConfirmDeletionModal = () => {};
  return (
    <ProductListItemContainer>
      <LeftContent>
        <PantryLeftIcon />
        <LeftText>{item.name}</LeftText>
      </LeftContent>
      <RightContent>
        <TouchableOpacity onPress={handleEdit}>
          <EditIcon />
        </TouchableOpacity>
        <TouchableOpacity onPress={showConfirmDeletionModal}>
          <DeleteIcon />
        </TouchableOpacity>
        <TouchableOpacity>
          <AddToPantryIcon />
        </TouchableOpacity>
        <DragHandler />
      </RightContent>
    </ProductListItemContainer>
  );
}

export const PantryListItemKeyExtractor = (p: IPantry) => p.getKey();

export default PantryListItem;
