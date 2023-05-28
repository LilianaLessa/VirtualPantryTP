import { IBaseModule, TableBuilder } from "expo-sqlite-wrapper";
import { DocumentData } from "firebase/firestore";
import {
  LocalTable,
  TableNames,
} from "../../../services/applicationData/localDatabase/tables";
import Product from "./product.class";
import Pantry from "../../pantries/classes/pantry.class";
import IFirestoreObject from "../../../services/firebase/interfaces/firestore-object.interface";

export default class StoredProduct
  extends IBaseModule<TableNames>
  implements IFirestoreObject
{
  uuid: string;

  storedAt: string;

  pantryUuid: string;

  name?: string;

  quantity?: number;

  bestBefore?: string;

  boughtPrice?: number;

  ownerUid: string;

  productUuid: string;

  firestoreId?: string;

  updatedAt?: string;

  prepared: number;

  eaten: number;

  expired: number;

  discarded: number;

  firestoreCollectionName = StoredProduct.getFirestoreCollectionName();

  firestoreDeletedCollectionName =
    StoredProduct.getFirestoreDeletedCollectionName();

  constructor(
    uuid: string,
    storedAt: string,
    pantryUuid?: string,
    name?: string,
    quantity?: number,
    bestBefore?: string,
    boughtPrice?: number,
    ownerUid?: string,
    productUuid?: string,
    id?: number,
    firestoreId?: string,
    updatedAt?: string,
    prepared?: number,
    eaten?: number,
    expired?: number,
    discarded?: number
  ) {
    super(LocalTable.STORED_PRODUCT);
    this.uuid = uuid;
    this.storedAt = storedAt;

    this.name = name ?? "";

    this.quantity = quantity ?? 1;

    this.bestBefore = bestBefore ?? "";

    this.boughtPrice = boughtPrice ?? 1;

    this.prepared = prepared ?? 0;
    this.eaten = eaten ?? 0;
    this.expired = expired ?? 0;
    this.discarded = discarded ?? 0;

    if (ownerUid) {
      this.ownerUid = ownerUid;
    }

    if (pantryUuid) {
      this.pantryUuid = pantryUuid;
    }

    if (productUuid) {
      this.productUuid = productUuid;
    }

    if (id) {
      this.id = id;
    }

    if (firestoreId) {
      this.firestoreId = firestoreId;
    }

    if (updatedAt) {
      this.updatedAt = updatedAt;
    }
  }

  clone(override?: Partial<StoredProduct>): StoredProduct {
    return new StoredProduct(
      override?.uuid ?? this.uuid,
      override?.storedAt ?? this.storedAt,
      override?.pantryUuid ?? this.pantryUuid,
      override?.name ?? this.name,
      override?.quantity ?? this.quantity,
      override?.bestBefore ?? this.bestBefore,
      override?.boughtPrice ?? this.boughtPrice,
      override?.ownerUid ?? this.ownerUid,
      override && override.hasOwnProperty("productUuid")
        ? override.productUuid
        : this.productUuid,
      override?.id ?? this.id,
      override?.firestoreId ?? this.firestoreId,
      override?.updatedAt ?? this.updatedAt,
      override?.prepared ?? this.prepared,
      override?.eaten ?? this.eaten,
      override?.expired ?? this.expired,
      override?.discarded ?? this.discarded
    );
  }

  getKey(): string {
    return `stored_product_${this.uuid}`;
  }

  static GetTableStructor() {
    return TableBuilder<StoredProduct, TableNames>(LocalTable.STORED_PRODUCT)
      .column("id")
      .primary.autoIncrement.number.column("uuid")
      .unique.string.column("pantryUuid")
      .constrain<Pantry>("pantryUuid", LocalTable.PANTRY, "uuid")
      .column("storedAt")
      .column("name")
      .nullable.column("quantity")
      .nullable.column("bestBefore")
      .nullable.column("boughtPrice")
      .nullable.column("ownerUid")
      .nullable.column("productUuid")
      .nullable.constrain<Product>("productUuid", LocalTable.PRODUCT, "uuid")
      .column("firestoreId")
      .nullable.column("updatedAt")
      .column("prepared")
      .nullable.number.column("eaten")
      .nullable.number.column("expired")
      .nullable.number.column("discarded").nullable.number;
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

  static getFirestoreCollectionName(): string {
    return "storedProduct";
  }

  static getFirestoreDeletedCollectionName(): string {
    return "deleted_storedProduct";
  }

  static buildFromFirestoreData(doc: DocumentData): StoredProduct {
    return new StoredProduct(
      doc.data().uuid,
      doc.data().storedAt,
      doc.data().pantryUuid,
      doc.data().name,
      doc.data().quantity,
      doc.data().bestBefore,
      doc.data().boughtPrice,
      doc.data().ownerUid,
      doc.data().productUuid,
      undefined,
      doc.id,
      doc.data().updatedAt,
      doc.data().prepared,
      doc.data().eaten,
      doc.data().expired,
      doc.data().discarded
    );
  }
}
