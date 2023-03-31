import { TextInput, View } from "react-native";
// eslint-disable-next-line import/no-extraneous-dependencies
import styled from "styled-components";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export const SearchBarContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  background-color: #efeff4;
  padding: 8px 0 8px 8px;
  height: 50px;
`;

export const SearchBarInputContainer = styled(View)`
  flex: 1;
  flex-direction: row;
  background-color: #ceced2;
  border-radius: 5px;
  padding: 0;
  margin: 0 7px 0 0;
`;

export const MagnifyingGlassIcon = styled(MaterialCommunityIcons).attrs({
  name: "magnify",
})`
  color: #000;
  font-size: 20px;
  align-self: center;
  padding-left: 5px;
  padding-right: 5px;
  margin: 0;
`;

export const BarCodeScanIcon = styled(MaterialCommunityIcons).attrs({
  name: "barcode-scan",
})`
  color: #000;
  font-size: 20px;
  align-self: center;
  padding-left: 5px;
  padding-right: 5px;
  margin: 0;
`;

export const SearchBarInput = styled(TextInput)`
  height: 32px;
  align-self: flex-start;
  font-size: 15px;
  line-height: 15px;
  color: #000;
  flex: 1;
  margin: 0;
`;
