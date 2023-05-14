import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components";
import { TextInput } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SearchBarContainer } from "../../products/components/product-search-bar.styles";

const NewUserEmailInput = styled(TextInput)`
  height: 32px;
  align-self: flex-start;
  font-size: 15px;
  line-height: 15px;
  color: #000;
  flex: 1;
  margin: 0;
`;

const BarCodeScanIcon = styled(MaterialCommunityIcons).attrs({
  name: "account-plus",
})`
  color: #000;
  font-size: 40px;
  align-self: center;
  padding-left: 5px;
  padding-right: 5px;
  margin: 0;
`;

export default function AddUserInput({
  addUserCallback,
}: {
  addUserCallback: (newUserEmail: string) => void;
}) {
  const [newUserEmail, setNewUserEmail] = useState("");

  const handleAddUser = () => {
    setNewUserEmail("");
    addUserCallback(newUserEmail);
  };

  return (
    <SearchBarContainer>
      <NewUserEmailInput
        mode="outlined"
        label="Add user"
        placeholder="Ex.: user@example.com"
        value={newUserEmail}
        onChangeText={(text) => setNewUserEmail(text)}
        keyboardType="email-address"
        style={{ width: "100%" }}
      />
      <TouchableOpacity onPress={handleAddUser}>
        <BarCodeScanIcon />
      </TouchableOpacity>
    </SearchBarContainer>
  );
}
