import { faker } from "@faker-js/faker";
// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 as uuidv4 } from "uuid";
import { Text, View } from "react-native";
import React from "react";
import { IProduct } from "./features/products/interfaces/product.interface";
import Product from "./features/products/classes/product.class";
import Pantry from "./features/pantries/classes/pantry.class";
import { IPantry } from "./features/pantries/interfaces/pantry.interface";
import { INotification } from "./features/notification/interfaces/notification.interface";
import IShoppingList from "./features/shoppingList/interfaces/shopping-list.interface";
import ShoppingList from "./features/shoppingList/classes/shopping-list.class";

export const createMockProduct = (): IProduct =>
  new Product(uuidv4(), "", faker.commerce.productName());

export const createMockShoppingLists = (): IShoppingList =>
  new ShoppingList(uuidv4(), faker.word.verb());

export const createMockPantry = (): IPantry =>
  new Pantry(uuidv4(), faker.name.firstName());

export function ScreenPlaceHolder({ route }) {
  const { screenName } = route.params;
  return (
    <View>
      <Text>{screenName} Screen Placeholder</Text>
    </View>
  );
}

export function getStackTraceAsString(e?: Error): string {
  const error = e ?? new Error();
  // console.log(stack);
  return error.stack
    .split("\n")
    .slice(2)
    .map((line) => line.replace(/\s+at\s+/, ""))
    .join("\n");
}
