import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

import Modal from "react-native-modal";

import {
  MaterialCommunityIcons,
  Entypo,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { IProduct } from "../interfaces/product.interface";
import { EditProductScreenRouteName } from "../../../infrastructure/navigation/route-names";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E6E6E6",
    flexDirection: "row",
    height: 45,
    alignSelf: "stretch",
    borderWidth: 1,
    borderColor: "#000000",
  },
  leftContent: {
    backgroundColor: "#E6E6E6",
    alignSelf: "stretch",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  leftIcon: {
    color: "rgba(0,0,0,1)",
    fontSize: 20,
    marginLeft: 10,
    margin: 0,
  },
  label: {
    color: "#121212",
    marginLeft: 10,
    margin: 0,
  },
  rightContent: {
    alignSelf: "stretch",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  addToPantryIcon: {
    color: "rgba(0,0,0,1)",
    fontSize: 25,
    marginLeft: 10,
    margin: 0,
  },
  editIcon: {
    color: "rgba(0,0,0,1)",
    fontSize: 25,
    marginLeft: 10,
    margin: 0,
  },
  tmpRemoveProductIcon: {
    color: "rgba(0,0,0,1)",
    fontSize: 25,
    marginLeft: 10,
    margin: 0,
  },
  draggableIcon: {
    color: "rgba(128,128,128,1)",
    fontSize: 20,
    marginLeft: 10,
    margin: 0,
    padding: 0,
    paddingRight: 10,
  },
  confirmModal1: {
    top: 0,
    left: 0,
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.5)",
    right: 0,
    bottom: 0,
  },
  confirmDialog1: {
    height: 150,
    width: 200,
    shadowColor: "rgba(0,0,0,1)",
    shadowOffset: {
      width: 3,
      height: 3,
    },
    elevation: 15,
    shadowOpacity: 1,
    shadowRadius: 5,
    marginTop: 247,
    marginLeft: 80,
  },
});

const modalStyles = StyleSheet.create({
  container: {
    backgroundColor: "#E6E6E6",
    borderWidth: 0,
    borderColor: "#000000",
    borderRadius: 20,
  },
  dialogTitleContainer: {
    backgroundColor: "#E6E6E6",
    alignSelf: "stretch",
    // flex: 0.1,
    margin: 15,
    marginRight: 15,
    marginLeft: 15,
  },
  dialogTitle: {
    // fontFamily: "open-sans-500",
    color: "#121212",
    width: 179,
    height: 32,
    fontSize: 18,
  },
  dialogContentContainer: {
    backgroundColor: "#E6E6E6",
    alignSelf: "stretch",
    // flex: 0.82,
    margin: 15,
    marginTop: 5,
    padding: 0,
    paddingTop: 0,
  },
  dialogContent: {
    // fontFamily: "open-sans-500",
    color: "#121212",
    fontSize: 12,
    width: 170,
    // flex: 1,
    marginBottom: -11,
    marginTop: 11,
    alignSelf: "center",
  },
  dialogButtonsContainer: {
    backgroundColor: "#E6E6E6",
    alignSelf: "stretch",
    // flex: 0.08,
    margin: 15,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  confirm: {
    // fontFamily: "open-sans-500",
    color: "rgba(186,0,13,1)",
    fontSize: 10,
  },
  cancel: {
    // fontFamily: "open-sans-500",
    color: "#121212",
    fontSize: 10,
  },
});

function ConfirmDialog({
  confirmHandler,
  cancelHandler,
  dialogTitle,
  dialogContent,
  confirm,
  cancel,
}: {
  confirmHandler: () => void;
  cancelHandler: () => void;
  dialogTitle?: string;
  dialogContent?: string;
  confirm?: string;
  cancel?: string;
}) {
  return (
    <View style={styles.confirmDialog1}>
      <View style={modalStyles.dialogTitleContainer}>
        <Text style={modalStyles.dialogTitle}>
          {dialogTitle || "Dialog Title"}
        </Text>
      </View>
      <View style={modalStyles.dialogContentContainer}>
        <Text style={modalStyles.dialogContent}>
          {dialogContent || "Dialog Content"}
        </Text>
      </View>
      <View style={modalStyles.dialogButtonsContainer}>
        <TouchableOpacity onPress={confirmHandler}>
          <Text style={modalStyles.confirm}>{confirm || "Confirm"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={cancelHandler}>
          <Text style={modalStyles.cancel}>{cancel || "Cancel"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

ConfirmDialog.defaultProps = {
  dialogTitle: "Dialog Title",
  dialogContent: "Dialog Content",
  confirm: "Confirm",
  cancel: "Cancel",
};

function ProductListItem({
  item,
  deleteProductCallback,
}: {
  item: IProduct;
  deleteProductCallback: (productToDelete: IProduct) => void;
}) {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const navigation = useNavigation();
  const toggleModal = () => setIsModalVisible(() => !isModalVisible);
  const handleSelfDelete = () => {
    setIsModalVisible(false);
    deleteProductCallback(item);
  };

  const handleEdit = () => {
    navigation.navigate(
      EditProductScreenRouteName as never,
      {
        product: item,
        isEdit: true,
        // eslint-disable-next-line comma-dangle
      } as never
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <MaterialCommunityIcons name="food-apple" style={styles.leftIcon} />
        <Text style={styles.label}>{item.name}</Text>
      </View>
      <View style={styles.rightContent}>
        <TouchableOpacity onPress={handleEdit}>
          <Entypo name="pencil" style={styles.editIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleModal}>
          <Entypo name="trash" style={styles.tmpRemoveProductIcon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Entypo name="box" style={styles.addToPantryIcon} />
        </TouchableOpacity>
        <MaterialIcons name="drag-handle" style={styles.draggableIcon} />
      </View>
      <Modal isVisible={isModalVisible}>
        <View style={styles.confirmModal1}>
          <ConfirmDialog
            confirm="Remover"
            cancel="Cancelar"
            dialogContent={`Deseja remover o produto '${item.name}'?`}
            dialogTitle="Remover Produto"
            cancelHandler={toggleModal}
            confirmHandler={handleSelfDelete}
          />
        </View>
      </Modal>
    </View>
  );
}

export const ProductListItemKeyExtractor = (p: IProduct) => p.getKey();
export default ProductListItem;
