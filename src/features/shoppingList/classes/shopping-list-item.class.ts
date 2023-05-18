import { IBaseModule, TableBuilder } from "expo-sqlite-wrapper";
import { DocumentData } from "firebase/firestore";
import {
  LocalTable,
  TableNames,
} from "../../../services/applicationData/localDatabase/tables";
import IFirestoreObject from "../../../services/firebase/interfaces/firestore-object.interface";

export default class ShoppingListItem
  extends IBaseModule<TableNames>
  implements IFirestoreObject
{
  static localTableName = LocalTable.SHOPPING_LIST_ITEM;

  uuid: string;

  shoppingListUuid: string;

  name: string;

  quantity: number;

  bought: boolean;

  boughtPrice: number;

  productUuid?: string;

  ownerUid?: string;

  firestoreId?: string;

  updatedAt?: string;

  firestoreCollectionName = ShoppingListItem.getFirestoreCollectionName();

  firestoreDeletedCollectionName =
    ShoppingListItem.getFirestoreDeletedCollectionName();

  constructor(
    uuid: string,
    shoppingListUuid: string,
    name?: string,
    quantity?: number,
    bought?: boolean,
    boughtPrice?: number,
    productUuid?: string,
    id?: number,
    ownerUid?: string,
    firestoreId?: string,
    updatedAt?: string
  ) {
    // if (typeof shoppingListUuid === "undefined") {
    //   throw new Error("shoppingListUuid cant be undefined");
    // }

    super(ShoppingListItem.localTableName);
    this.uuid = uuid;
    this.shoppingListUuid = shoppingListUuid;
    this.name = name ?? "";
    this.quantity = quantity ?? 0;
    this.bought = bought ?? false;
    this.boughtPrice = boughtPrice ?? 0;

    if (typeof productUuid !== "undefined") {
      this.productUuid = productUuid;
    }
    if (typeof id !== "undefined") {
      this.id = id;
    }
    if (typeof ownerUid !== "undefined") {
      this.ownerUid = ownerUid;
    }
    if (typeof firestoreId !== "undefined") {
      this.firestoreId = firestoreId;
    }
    if (typeof updatedAt !== "undefined") {
      this.updatedAt = updatedAt;
    }
  }

  getKey(): string {
    return `shopping_list_item_${this.uuid}`;
  }

  clone(override?: Partial<ShoppingListItem>): ShoppingListItem {
    return new ShoppingListItem(
      override?.uuid ?? this.uuid,
      override?.shoppingListUuid ?? this.shoppingListUuid,
      override?.name ?? this.name,
      override?.quantity ?? this.quantity,
      override?.bought ?? this.bought,
      override?.boughtPrice ?? this.boughtPrice,
      override?.productUuid ?? this.productUuid,
      override?.id ?? this.id,
      override?.ownerUid ?? this.ownerUid,
      override?.firestoreId ?? this.firestoreId,
      override?.updatedAt ?? this.updatedAt
    );
  }

  static GetTableStructor() {
    return TableBuilder<ShoppingListItem, TableNames>(
      ShoppingListItem.localTableName
    )
      .column("id")
      .primary.autoIncrement.number.column("uuid")
      .unique.string.column("shoppingListUuid")
      .column("name")
      .nullable.column("ownerUid")
      .nullable.column("updatedAt")
      .nullable.column("firestoreId")
      .nullable.objectPrototype(ShoppingListItem.prototype);
  }

  static buildFromDatabaseResult(r: ShoppingListItem): ShoppingListItem {
    return new ShoppingListItem(
      r.uuid,
      r.shoppingListUuid,
      r.name,
      r.quantity,
      r.bought,
      r.boughtPrice,
      r.productUuid,
      r.id,
      r.ownerUid,
      r.firestoreId,
      r.updatedAt
    );
  }

  getFirestoreData(): object {
    const {
      id,
      tableName,
      firestoreCollectionName,
      firestoreDeletedCollectionName,
      firestoreId,
      ...data
    } = this;
    return data;
  }

  static buildFromFirestoreData(doc: DocumentData): ShoppingListItem {
    return new ShoppingListItem(
      doc.data().uuid,
      doc.data().shoppingListUuid,
      doc.data().name,
      doc.data().quantity,
      doc.data().bought,
      doc.data().boughtPrice,
      doc.data().productUuid,
      undefined,
      doc.data().ownerUid,
      doc.id,
      doc.data().updatedAt
    );
  }

  static getFirestoreCollectionName(): string {
    return "shoppingListItem";
  }

  static getFirestoreDeletedCollectionName(): string {
    return "deleted_shoppingListItem";
  }
}
