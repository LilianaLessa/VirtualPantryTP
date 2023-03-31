import { faker } from "@faker-js/faker";
// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 as uuidv4 } from "uuid";
import { Text, View } from "react-native";
import React from "react";
import { IProduct } from "./features/products/interfaces/product.interface";
import ProductClass from "./features/products/classes/product.class";

export const createMockProduct = (): IProduct =>
  new ProductClass(uuidv4(), "", faker.commerce.productName());

export function ScreenPlaceHolder({ route }) {
  const { screenName } = route.params;
  return (
    <View>
      <Text>{screenName} Screen Placeholder</Text>
    </View>
  );
}
