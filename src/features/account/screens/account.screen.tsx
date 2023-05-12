import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";

function AccountScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    console.log("SignIn with credentials", email, password.replace(/./g, "*"));
  };

  return (
    <View>
      <TextInput
        mode="outlined"
        label="Email"
        placeholder="test@test.com"
        value={email}
        onChangeText={(text) => setEmail(text as unknown as number)}
        keyboardType="email-address"
        style={{ width: "100%" }}
      />
      <HelperText visible type="info" padding="none">
        email
      </HelperText>

      <TextInput
        mode="outlined"
        label="password"
        placeholder="your password here"
        value={password}
        onChangeText={(text) => setPassword(text as unknown as number)}
        style={{ width: "100%" }}
        secureTextEntry
      />
      <HelperText visible type="info" padding="none">
        password
      </HelperText>

      <TouchableOpacity onPress={handleSignIn}>
        <Button mode="contained">Sign In</Button>
      </TouchableOpacity>
      <TouchableOpacity>
        <Button mode="contained-tonal">Sign Up</Button>
      </TouchableOpacity>
    </View>
  );
}

export default AccountScreen;
