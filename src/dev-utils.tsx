import { faker } from "@faker-js/faker";
// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 as uuidv4 } from "uuid";
import { Text, View } from "react-native";
import React from "react";
import { IProduct } from "./features/products/interfaces/product.interface";
import Product from "./features/products/classes/product.class";
import Pantry from "./features/pantry/classes/pantry.class";
import { IPantry } from "./features/pantry/interfaces/pantry.interface";

export const createMockProduct = (): IProduct =>
  new Product(uuidv4(), "", faker.commerce.productName());

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
