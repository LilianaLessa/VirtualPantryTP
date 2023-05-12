import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
import { AuthenticationContext } from "../../../services/firebase/authentication.context";

function AccountScreen() {
  const { onLogin, user } = useContext(AuthenticationContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentUser, setCurrentUser] = useState(user);

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  const handleSignIn = () => {
    // console.log("SignIn with credentials", email, password.replace(/./g, "*"));
    if (onLogin) {
      onLogin(email, password);
    }
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
      {currentUser && (
        <View>
          <Text>{`Logged as ${currentUser.email}`}</Text>
        </View>
      )}
      {!currentUser && (
        <View>
          <Text>Unlogged</Text>
        </View>
      )}
    </View>
  );
}

export default AccountScreen;
