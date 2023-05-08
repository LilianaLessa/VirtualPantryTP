import styled from "styled-components";
import { FontAwesome } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

export const NotificationContainer = styled(TouchableOpacity)`
  background-color: #e6e6e6;
  flex-direction: row;
  padding: 5px;
  align-items: center;
  border-width: 1px;
  border-color: #000000;
`;

export const ExpirationNoticeLeftIcon = styled(FontAwesome).attrs({
  name: "warning",
})`
  color: rgba(128, 128, 128, 1);
  font-size: 20px;
  margin: 10px 10px 10px 0;
`;

export const NotificationMessageContainer = styled(View)`
  background-color: #e6e6e6;
  margin: 10px 10px 10px 0;
  align-self: stretch;
  flex: 1;
`;

export const NotificationMessage = styled(Text)`
  color: #121212;
  font-size: 15px;
  margin-top: 5px;
  align-self: stretch;
`;

export const NotificationDatetime = styled(Text)`
  color: rgba(128, 128, 128, 1);
  font-size: 10px;
  margin-top: 5px;
`;
