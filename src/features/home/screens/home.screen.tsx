import React from "react";
import { useNavigation } from "@react-navigation/native";

import {
  GroupsRouteName,
  PantriesScreenRouteName,
  ProductScreenRouteName,
  ShoppingListsRouteName,
} from "../../../infrastructure/navigation/route-names";
import {
  HomeScreenButton,
  HomeScreenButtonIcon,
  HomeScreenContentContainer,
} from "./home.styles";

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <HomeScreenContentContainer>
      <HomeScreenButton
        onPress={() => navigation.navigate(ProductScreenRouteName as never)}
      >
        <HomeScreenButtonIcon name="food-apple" />
        Products
      </HomeScreenButton>
      <HomeScreenButton
        onPress={() => navigation.navigate(PantriesScreenRouteName as never)}
      >
        <HomeScreenButtonIcon name="dropbox" />
        Pantries
      </HomeScreenButton>
      <HomeScreenButton
        onPress={() => navigation.navigate(ShoppingListsRouteName as never)}
      >
        <HomeScreenButtonIcon name="format-list-bulleted" />
        Shopping Lists
      </HomeScreenButton>
      <HomeScreenButton
        onPress={() => navigation.navigate(GroupsRouteName as never)}
      >
        <HomeScreenButtonIcon name="account-group" />
        Groups
      </HomeScreenButton>
    </HomeScreenContentContainer>
  );
}

export default HomeScreen;
