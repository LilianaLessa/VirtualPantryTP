// eslint-disable-next-line import/no-extraneous-dependencies
import styled from "styled-components";
import { Text, View } from "react-native";
import {
  Entypo,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

export const ProductListItemContainer = styled(View)`
  background-color: #e6e6e6;
  flex-direction: row;
  height: 45px;
  align-self: stretch;
  border-width: 1px;
  border-color: #000000;
`;

export const LeftContent = styled(View)`
  background-color: #e6e6e6;
  align-self: stretch;
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

export const LeftIcon = styled(MaterialCommunityIcons).attrs({
  name: "food-apple",
})`
  color: rgba(0, 0, 0, 1);
  font-size: 20px;
  margin-left: 10px;
`;

export const LeftText = styled(Text)`
  color: #121212;
  margin-left: 10px;
`;

export const RightContent = styled(View)`
  align-self: stretch;
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const EntypoIcon = styled(Entypo)`
  color: rgba(0, 0, 0, 1);
  font-size: 25px;
  margin-left: 10px;
`;

export const EditIcon = styled(EntypoIcon).attrs({ name: "pencil" })``;

export const DeleteIcon = styled(EntypoIcon).attrs({ name: "trash" })``;

export const AddToPantryIcon = styled(EntypoIcon).attrs({ name: "box" })``;

export const DragHandler = styled(MaterialIcons).attrs({ name: "drag-handle" })`
  color: rgba(128, 128, 128, 1);
  font-size: 20px;
  margin-left: 10px;
  padding-right: 10px;
`;
