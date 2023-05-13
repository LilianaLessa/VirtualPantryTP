import React from "react";
import { useNavigation } from "@react-navigation/native";

import {
  GroupsScreenRouteName,
  PantriesScreenRouteName,
  ProductScreenRouteName,
  ShoppingListsRouteName,
} from "../../../infrastructure/navigation/route-names";
import {
  HomeScreenButton,
  HomeScreenButtonIcon,
  HomeScreenButtonLabel,
  HomeScreenButtonsContainer,
  HomeScreenContentContainer,
} from "./home.styles";

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <HomeScreenContentContainer>
      <HomeScreenButtonsContainer />
      <HomeScreenButtonsContainer>
        <HomeScreenButton
          onPress={() => navigation.navigate(ProductScreenRouteName as never)}
        >
          <HomeScreenButtonIcon name="food-apple" />
          <HomeScreenButtonLabel>Products</HomeScreenButtonLabel>
        </HomeScreenButton>
        <HomeScreenButton
          onPress={() => navigation.navigate(PantriesScreenRouteName as never)}
        >
          <HomeScreenButtonIcon name="dropbox" />
          <HomeScreenButtonLabel>Pantries</HomeScreenButtonLabel>
        </HomeScreenButton>
      </HomeScreenButtonsContainer>
      <HomeScreenButtonsContainer>
        <HomeScreenButton
          onPress={() => navigation.navigate(ShoppingListsRouteName as never)}
        >
          <HomeScreenButtonIcon name="format-list-bulleted" />
          <HomeScreenButtonLabel>Shopping Lists</HomeScreenButtonLabel>
        </HomeScreenButton>
        <HomeScreenButton
          onPress={() => navigation.navigate(GroupsScreenRouteName as never)}
        >
          <HomeScreenButtonIcon name="account-group" />
          <HomeScreenButtonLabel>Groups</HomeScreenButtonLabel>
        </HomeScreenButton>
      </HomeScreenButtonsContainer>
      <HomeScreenButtonsContainer />
    </HomeScreenContentContainer>
  );
}

export default HomeScreen;
