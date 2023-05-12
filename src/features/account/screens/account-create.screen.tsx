import React, { useContext, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { AuthenticationContext } from "../../../services/firebase/authentication.context";
import { HomeScreenRouteName } from "../../../infrastructure/navigation/route-names";

export type AccountCreateScreenParams = {
  AccountCreate: {
    email?: string;
  };
};

type Props = RouteProp<AccountCreateScreenParams, "AccountCreate">;

function AccountCreateScreen({ route }: { route: Props }) {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState(route.params.email ?? "");
  const [emailConfirmation, setEmailConfirmation] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const { createAccount } = useContext(AuthenticationContext);

  const navigation = useNavigation();

  const handleAccountCreate = () => {
    setErrors([]);
    const currentErrors = Array<string>();

    if (email !== emailConfirmation) {
      currentErrors.push("Email and Email confirmation does not match.");
    }

    if (password !== passwordConfirmation) {
      currentErrors.push("Password and Password confirmation does not match.");
    }

    setErrors(currentErrors);

    if (currentErrors.length < 1 && createAccount) {
      createAccount(
        email,
        password,
        displayName,
        () => {
          navigation.navigate(HomeScreenRouteName as never);
        },
        (e) => {
          console.log(e.toString());
          setErrors([...errors, e.toString()]);
        }
      );
    }
  };

  return (
    <View>
      <TextInput
        mode="outlined"
        label="Name"
        placeholder="Jane Doe"
        value={displayName}
        onChangeText={(text) => setDisplayName(text)}
        style={{ width: "100%" }}
      />
      <HelperText visible type="info" padding="none">
        Name
      </HelperText>
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
        label="Email Confirmation"
        placeholder="test@test.com"
        value={emailConfirmation}
        onChangeText={(text) => setEmailConfirmation(text)}
        keyboardType="email-address"
        style={{ width: "100%" }}
      />
      <HelperText visible type="info" padding="none">
        email confirmation
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
      <TextInput
        mode="outlined"
        label="password"
        placeholder="repeat your password"
        value={passwordConfirmation}
        onChangeText={(text) => setPasswordConfirmation(text)}
        style={{ width: "100%" }}
        secureTextEntry
      />
      <HelperText visible type="info" padding="none">
        password confirmation
      </HelperText>
      <TouchableOpacity onPress={handleAccountCreate}>
        <Button mode="contained">Sign Up</Button>
      </TouchableOpacity>
      {errors && (
        <View>
          <FlatList
            data={errors}
            renderItem={({ item }: { item: string }) => <Text>{item}</Text>}
            keyExtractor={(i) => `key_${i}`}
          />
        </View>
      )}
    </View>
  );
}

export default AccountCreateScreen;
