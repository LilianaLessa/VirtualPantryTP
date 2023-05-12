import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { AuthenticationContext } from "../../../services/firebase/authentication.context";
import { CreateAccountScreenRouteName } from "../../../infrastructure/navigation/route-names";

function AccountScreen() {
  const navigation = useNavigation();
  const { onLogin, onLogout, user, error } = useContext(AuthenticationContext);

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

  const handleSignOut = () => {
    console.log("Sign out");
    if (onLogout) {
      onLogout();
    }
  };

  const handleSignUp = () => {
    navigation.navigate(
      CreateAccountScreenRouteName as never,
      {
        email,
      } as never
    );
  };

  return (
    <View>
      {currentUser && (
        <View>
          <Text>{`Logged as ${currentUser.email}`}</Text>
          <TouchableOpacity onPress={handleSignOut}>
            <Button mode="contained">Sign out</Button>
          </TouchableOpacity>
        </View>
      )}
      {!currentUser && (
        <View>
          <TextInput
            mode="outlined"
            label="Email"
            placeholder="test@test.com"
            value={email}
            onChangeText={(text) => setEmail(text)}
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
            onChangeText={(text) => setPassword(text)}
            style={{ width: "100%" }}
            secureTextEntry
          />
          <HelperText visible type="info" padding="none">
            password
          </HelperText>
          <TouchableOpacity onPress={handleSignIn}>
            <Button mode="contained">Sign In</Button>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSignUp}>
            <Button mode="contained-tonal">Sign Up</Button>
          </TouchableOpacity>
          {error && <Text>{`Error: ${error}`}</Text>}
        </View>
      )}
    </View>
  );
}

export default AccountScreen;
