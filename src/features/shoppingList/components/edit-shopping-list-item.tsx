import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import ShoppingListItem from "../classes/shopping-list-item.class";

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: "#E6E6E6",
    flexDirection: "row",
    alignSelf: "stretch",
    // alignItems: "center",
  },
  x: {
    color: "#121212",
    margin: 0,
    marginRight: 5,
  },
});

const styles1 = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderColor: "#D9D5DC",
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
  },
  inputStyle: {
    width: 30,
    color: "#000",
    fontSize: 16,
    alignSelf: "stretch",
  },
});

const styles2 = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderColor: "#D9D5DC",
    backgroundColor: "transparent",
    flexDirection: "row",
    // alignItems: "stretch",
    justifyContent: "space-between",
  },
  inputStyle: {
    color: "#000",
    fontSize: 16,
    lineHeight: 16,
    width: 150,
  },
  iconStyle: {
    color: "#616161",
    fontSize: 24,
    paddingRight: 8,
  },
});

function EditShoppingListItem({
  shoppingListItem,
  removeItemCallback,
}: {
  shoppingListItem: ShoppingListItem;
  removeItemCallback: (item: ShoppingListItem) => void;
}) {
  const handleSelfDelete = () => removeItemCallback(shoppingListItem);

  const [quantity, setQuantity] = useState(shoppingListItem?.quantity ?? 0);
  const [name, setName] = useState(shoppingListItem?.name ?? "");

  useEffect(() => {
    shoppingListItem.name = name;
    shoppingListItem.quantity = quantity;
  }, [quantity, name]);

  return (
    <View style={styles.itemContainer}>
      <View style={styles1.container}>
        <TextInput
          placeholder="1"
          keyboardType="numeric"
          style={styles1.inputStyle}
          onChangeText={(text) => {
            setQuantity(Number(text));
          }}
          value={quantity.toString()}
        />
      </View>
      <Text style={styles.x}>x</Text>
      <View style={styles2.container}>
        <TextInput
          placeholder="Label"
          style={styles2.inputStyle}
          onChangeText={(text) => {
            setName(text);
          }}
          value={name}
        />
        <TouchableOpacity onPress={handleSelfDelete}>
          <Entypo name="trash" style={styles2.iconStyle} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default EditShoppingListItem;
