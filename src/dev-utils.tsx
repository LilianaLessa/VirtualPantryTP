import { faker } from "@faker-js/faker";
// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 as uuidv4 } from "uuid";
import { Text, View } from "react-native";
import React from "react";
import Product from "./features/products/classes/product.class";
import { IProduct } from "./features/products/interfaces/product.interface";

export const createMockProduct = (): IProduct =>
  new Product(uuidv4(), faker.commerce.productName());

export function ScreenPlaceHolder({ route }) {
  const { screenName } = route.params;
  return (
    <View>
      <Text>{screenName} Screen Placeholder</Text>
    </View>
  );
}
