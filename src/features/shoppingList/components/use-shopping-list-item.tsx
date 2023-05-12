import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { Checkbox } from "react-native-paper";
import materialCommunityIconsFont from "react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf";
import { useFonts } from "expo-font";
import IShoppingListItem from "../interfaces/shopping-list-item.interface";

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
  inputStyle2: {
    width: 50,
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

function UseShoppingListItem({
  shoppingListItem,
  updateItemCallback,
  storeItemCallback,
  copyItemCallback,
  deleteItemCallback,
}: {
  shoppingListItem: IShoppingListItem;
  updateItemCallback: (uuid: string) => void;
  storeItemCallback: (uuid: string) => void;
  copyItemCallback: (uuid: string) => void;
  deleteItemCallback: (uuid: string) => void;
}) {
  const handleSelfDelete = () => deleteItemCallback(shoppingListItem.uuid);
  const handleSelfStore = () => storeItemCallback(shoppingListItem.uuid);
  const handleSelfCopy = () => copyItemCallback(shoppingListItem.uuid);

  const [quantity, setQuantity] = useState(shoppingListItem.quantity ?? 0);
  const [boughtPrice, setBoughtPrice] = useState(
    shoppingListItem?.boughtPrice ?? 0
  );
  const [bought, setBought] = React.useState(shoppingListItem.bought);
  const [name, setName] = useState(shoppingListItem.name ?? "");

  useEffect(() => {
    shoppingListItem.name = name;
    shoppingListItem.quantity = quantity;
    shoppingListItem.boughtPrice = boughtPrice;
    shoppingListItem.bought = bought;
    updateItemCallback(shoppingListItem.uuid);
  }, [name, quantity, boughtPrice, bought]);

  const [materialCommunityIconsFontLoaded] = useFonts({
    MaterialCommunityIcons: materialCommunityIconsFont,
  });

  if (!materialCommunityIconsFontLoaded) {
    // console.log("font not loaded"); //todo put an activity indicator here?
    return null;
  }

  return (
    <View style={styles.itemContainer}>
      <View style={styles2.container}>
        {}
        <Checkbox
          status={bought ? "checked" : "unchecked"}
          onPress={() => {
            setBought(!bought);
          }}
        />
        <TextInput
          placeholder="Label"
          style={styles2.inputStyle}
          onChangeText={(text) => {
            setName(text);
          }}
          value={name}
        />
      </View>
      <Text style={styles.x}>x</Text>
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
      <Text style={styles.x}>for</Text>
      <View style={styles1.container}>
        <TextInput
          placeholder="1"
          keyboardType="number-pad"
          style={styles1.inputStyle2}
          onChangeText={(text) => {
            setBoughtPrice(text as unknown as number);
          }}
          value={boughtPrice.toString()}
        />
      </View>
      <TouchableOpacity onPress={handleSelfStore}>
        <Entypo name="box" style={styles2.iconStyle} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSelfCopy}>
        <Entypo name="copy" style={styles2.iconStyle} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSelfDelete}>
        <Entypo name="trash" style={styles2.iconStyle} />
      </TouchableOpacity>
    </View>
  );
}

export default UseShoppingListItem;
