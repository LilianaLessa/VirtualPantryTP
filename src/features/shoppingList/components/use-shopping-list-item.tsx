import React, { useContext, useEffect, useState } from "react";
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
import { v4 as uuidv4 } from "uuid";
import IShoppingListItem from "../interfaces/shopping-list-item.interface";
import { DependencyInjectionContext } from "../../../services/dependencyInjection/dependency-injection.context";
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
}: {
  shoppingListItem: IShoppingListItem;
}) {
  const { shoppingListService, navigationService, pantryService } = useContext(
    DependencyInjectionContext
  );

  const [quantity, setQuantity] = useState(shoppingListItem.quantity ?? 0);
  const [boughtPrice, setBoughtPrice] = useState(
    shoppingListItem?.boughtPrice ?? 0
  );
  const [bought, setBought] = React.useState(shoppingListItem.bought);
  const [name, setName] = useState(shoppingListItem.name ?? "");
  const [materialCommunityIconsFontLoaded] = useFonts({
    MaterialCommunityIcons: materialCommunityIconsFont,
  });

  if (!materialCommunityIconsFontLoaded) {
    // console.log("font not loaded"); //todo put an activity indicator here?
    return null;
  }

  const handleSelfStore = () => {
    navigationService.showStoreProductScreen(
      pantryService.createStoredProduct({
        name: shoppingListItem.name,
        quantity: shoppingListItem.quantity,
        boughtPrice: shoppingListItem.boughtPrice,
      })
    );
  };

  const handleSelfDelete = () => {
    shoppingListService.deleteShoppingListItem(shoppingListItem).then(() => {
      // console.log(`Shopping list item '${shoppingListItem.uuid}' deleted`);
    });
  };

  function updateShoppingListItem(data: Partial<ShoppingListItem>) {
    return shoppingListService
      .saveShoppingListItem(shoppingListItem.clone(data))
      .then(() => {
        // console.log(`Shopping list item '${shoppingListItem.uuid}' updated`);
      });
  }

  return (
    <TouchableOpacity
      onPress={() => {
        updateShoppingListItem({
          bought: !bought,
        }).then(() => {
          setBought(!bought);
        });
      }}
    >
      <View style={styles.itemContainer}>
        <View style={styles2.container}>
          <Checkbox status={bought ? "checked" : "unchecked"} />

          <TextInput
            editable={false}
            placeholder="Label"
            style={{
              ...styles2.inputStyle,
              ...(bought ? { textDecorationLine: "line-through" } : {}),
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
            onSubmitEditing={() => {
              updateShoppingListItem({
                quantity,
              });
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
            onSubmitEditing={() => {
              updateShoppingListItem({
                boughtPrice,
              });
            }}
            value={boughtPrice.toString()}
          />
        </View>
        <TouchableOpacity onPress={handleSelfStore}>
          <Entypo name="box" style={styles2.iconStyle} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSelfDelete}>
          <Entypo name="trash" style={styles2.iconStyle} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default UseShoppingListItem;
