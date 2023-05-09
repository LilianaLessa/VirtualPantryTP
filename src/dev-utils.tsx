import { faker } from "@faker-js/faker";
// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 as uuidv4 } from "uuid";
import { Text, View } from "react-native";
import React from "react";
import { IProduct } from "./features/products/interfaces/product.interface";
import Product from "./features/products/classes/product.class";
import Pantry from "./features/pantries/classes/pantry.class";
import { IPantry } from "./features/pantries/interfaces/pantry.interface";
import ProductExpirationNoticeNotification from "./features/notification/classes/product-expiration-notice-notification.class";
import { INotification } from "./features/notification/interfaces/notification.interface";
import IShoppingList from "./features/shoppingList/interfaces/shopping-list.interface";
import ShoppingList from "./features/shoppingList/classes/shopping-list.class";

export const createMockProduct = (): IProduct =>
  new Product(uuidv4(), "", faker.commerce.productName());

export const createMockShoppingLists = (): IShoppingList =>
  new ShoppingList(uuidv4(), faker.word.verb());

export const createMockNotification = (): INotification =>
  new ProductExpirationNoticeNotification(
    uuidv4(),
    new Date(),
    false,
    {
      product: {
        name: faker.word.noun(),
      },
    },
    faker.random.numeric() as unknown as number
  );

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
