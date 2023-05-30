import { faker } from "@faker-js/faker";
// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 as uuidv4 } from "uuid";
import { Text, View } from "react-native";
import React from "react";
import Product from "./features/products/classes/product.class";
import Pantry from "./features/pantries/classes/pantry.class";
import ShoppingList from "./features/shoppingList/classes/shopping-list.class";
import Group from "./features/group/classes/group.class";
import UserInGroup, {
  UseInGroupAcceptanceState,
} from "./features/group/classes/user-in-group.class";
import Notification from "./features/notification/classes/notification.class";
import StoredProduct from "./features/products/classes/stored.product";
import ShoppingListItem from "./features/shoppingList/classes/shopping-list-item.class";

export function getStackTraceAsString(error: Error): string {
  if (error.stack) {
    return error.stack
      .split("\n")
      .slice(2)
      .map((line) => line.replace(/\s+at\s+/, ""))
      .join("\n");
  }

  return "";
}

export function createMockShoppingListItem(): ShoppingListItem {
  return new ShoppingListItem(uuidv4(), "");
}

export function createMockShoppingList(): ShoppingList {
  return new ShoppingList(uuidv4());
}

export const createMockProduct = (name?: string): Product =>
  new Product(uuidv4(), "", name ?? faker.commerce.productName());

export const createMockShoppingLists = (): ShoppingList =>
  new ShoppingList(uuidv4(), faker.word.verb());

export const createMockPantry = (name?: string): Pantry =>
  new Pantry(uuidv4(), name ?? faker.name.firstName());

export function ScreenPlaceHolder({ route }: { route: { params: any } }) {
  const { screenName } = route.params;
  return (
    <View>
      <Text>{screenName} Screen Placeholder</Text>
    </View>
  );
}

export function createMockStoredProduct(): StoredProduct {
  return new StoredProduct(uuidv4(), "");
}

export function createMockGroup(): Group {
  return new Group(uuidv4(), "mock group", "ownerUid");
}

export function createMockUserInGroup(group: Group): UserInGroup {
  return new UserInGroup(
    uuidv4(),
    "",
    group.uuid,
    "",
    false,
    false,
    UseInGroupAcceptanceState.PENDING
  );
}

export function createMockNotification(): Notification {
  return new Notification(
    "UUID",
    undefined,
    undefined,
    false,
    new Date().toLocaleDateString(),
    ""
  );
}
