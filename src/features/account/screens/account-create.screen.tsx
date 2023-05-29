import React, { useContext, useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { FirebaseError } from "firebase/auth";
import { AuthenticationContext } from "../../../services/firebase/authentication.context";
import { HomeScreenRouteName } from "../../../infrastructure/navigation/route-names";
import { DependencyInjectionContext } from "../../../services/dependencyInjection/dependency-injection.context";
import { useActions } from "../../../hooks/useActions";

export type AccountCreateScreenParams = {
  AccountCreate: {
    email?: string;
  };
};

type Props = RouteProp<AccountCreateScreenParams, "AccountCreate">;

function AccountCreateScreen({ route }: { route: Props }) {
  const { snackBarService } = useContext(DependencyInjectionContext);
  const { showLoadingActivityIndicator, hideLoadingActivityIndicator } =
    useActions();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState(route.params.email ?? "");
  const [emailConfirmation, setEmailConfirmation] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const { createAccount } = useContext(AuthenticationContext);

  const navigation = useNavigation();

  useEffect(() => {
    if (errors.length > 0) {
      snackBarService.showAccountCreationError(errors);
    }
  }, [errors]);

  const handleAccountCreate = () => {
    showLoadingActivityIndicator();
    const currentErrors: string[] = [];

    if (email.length < 5) {
      currentErrors.push("Inserted email too short.");
    }

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
          hideLoadingActivityIndicator();
          navigation.navigate(HomeScreenRouteName as never);
        },
        (e: FirebaseError) => {
          hideLoadingActivityIndicator();
          let message = "Error on creating account.";
          switch (e.code) {
            case "auth/weak-password":
              message = "Please use a stronger password: minimum 6 characters.";
              break;
            case "auth/email-already-in-use":
              message =
                "It was not possible to create a new account with this e-mail. Please choose another one.";
              break;
            default:
              console.log(e);
          }
          setErrors([...currentErrors, message]);
        }
      );
    } else {
      hideLoadingActivityIndicator();
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
    </View>
  );
}

export default AccountCreateScreen;
