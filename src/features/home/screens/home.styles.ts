import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button } from "react-native-paper";
// eslint-disable-next-line import/no-extraneous-dependencies
import styled from "styled-components";
import { View } from "react-native";

export const HomeScreenContentContainer = styled(View)`
  padding: 10px;
`;

export const HomeScreenButtonIcon = styled(MaterialCommunityIcons)`
  color: rgba(0, 0, 0, 1);
  font-size: 20px;
  margin-left: 10px;
`;

export const HomeScreenButton = styled(Button).attrs({ mode: "contained" })``;
