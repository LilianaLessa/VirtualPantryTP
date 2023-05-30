import { faker } from "@faker-js/faker";
// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 as uuidv4 } from "uuid";
import { Text, View } from "react-native";
import React from "react";
import Product from "./features/products/classes/product.class";
import Pantry from "./features/pantries/classes/pantry.class";
import ShoppingList from "./features/shoppingList/classes/shopping-list.class";

export const createMockProduct = (): Product =>
  new Product(uuidv4(), "", faker.commerce.productName());

export const createMockShoppingLists = (): ShoppingList =>
  new ShoppingList(uuidv4(), faker.word.verb());

export const createMockPantry = (): Pantry =>
  new Pantry(uuidv4(), faker.name.firstName());

export function ScreenPlaceHolder({ route }: { route: { params: any } }) {
  const { screenName } = route.params;
  return (
    <View>
      <Text>{screenName} Screen Placeholder</Text>
    </View>
  );
}

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
