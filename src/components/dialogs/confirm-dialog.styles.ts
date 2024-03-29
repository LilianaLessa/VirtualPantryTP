import styled from "styled-components";
import { Text, View } from "react-native";

export const DialogBoxContainer = styled(View)`
  height: 150px;
  width: 200px;
  box-shadow: 3px 3px 5px black;
  margin: auto;
  background-color: #ffffff;
`;

export const DialogTitleContainer = styled(View)`
  background-color: #e6e6e6;
  align-self: stretch;
  margin: 15px;
`;

export const DialogTitle = styled(Text)`
  color: #121212;
  width: 179px;
  height: 32px;
  font-size: 18px;
`;

export const DialogContentContainer = styled(View)`
  align-self: stretch;
  margin: 5px 15px 15px 15px;
  padding: 0;
`;

export const DialogContent = styled(Text)`
  color: #121212;
  font-size: 15px;
  width: 170px;
  padding-bottom: -11px;
  padding-top: 11px;
  align-self: center;
`;

export const DialogButtonsContainer = styled(View)`
  background-color: #ffffff;
  align-self: stretch;
  margin: 15px;
  flex-direction: row;
  justify-content: space-around;
`;

export const DialogConfirmButtonLabel = styled(Text)`
  border: 1px;
  background-color: #e77d7d;
  color: rgb(166, 0, 0);
  font-size: 15px;
  padding-left: 5px;
  padding-right: 5px;
  font-weight: bold;
`;

export const DialogCancelButtonLabel = styled(Text)`
  border: 1px;
  background-color: #c4c0c0;
  color: #121212;
  font-size: 15px;
  padding-left: 5px;
  padding-right: 5px;
  font-weight: bold;
`;
