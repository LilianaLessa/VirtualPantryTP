import { MaterialCommunityIcons } from "@expo/vector-icons";
import styled from "styled-components";
import { Text, TouchableOpacity, View } from "react-native";

export const HomeScreenContentContainer = styled(View)`
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
`;

export const HomeScreenButtonsContainer = styled(View)`
  flex: 1;
  flex-direction: row;
  width: 100%;
  justify-content: space-around;
  align-items: center;
`;

export const HomeScreenButton = styled(TouchableOpacity)`
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-content: center;
  height: 145px;
  margin: 5%;
  text-align: center;
  background-color: rgba(0, 41, 132, 1);
  border-radius: 10px;
`;

export const HomeScreenButtonIcon = styled(MaterialCommunityIcons)`
  color: white;
  font-size: 30px;
`;

export const HomeScreenButtonLabel = styled(Text)`
  color: rgba(255, 255, 255, 1);
  font-size: 15px;
  text-align: center;
  font-weight: bold;
`;
