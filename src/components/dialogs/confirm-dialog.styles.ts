// eslint-disable-next-line import/no-extraneous-dependencies
import styled from "styled-components";
import { Text, View } from "react-native";

export const DialogBoxContainer = styled(View)`
  height: 150px;
  width: 200px;
  box-shadow: 3px 3px 5px black;
  margin: auto;
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
  background-color: #e6e6e6;
  align-self: stretch;
  margin: 5px 15px 15px 15px;
  padding: 0;
`;

export const DialogContent = styled(Text)`
  color: #121212;
  font-size: 12px;
  width: 170px;
  margin-bottom: -11px;
  margin-top: 11px;
  align-self: center;
`;

export const DialogButtonsContainer = styled(View)`
  background-color: #e6e6e6;
  align-self: stretch;
  margin: 15px;
  flex-direction: row;
  justify-content: space-around;
`;

export const DialogConfirmButtonLabel = styled(Text)`
  color: rgba(186, 0, 13, 1);
  font-size: 10px;
`;

export const DialogCancelButtonLabel = styled(Text)`
  color: #121212;
  font-size: 10px;
`;
