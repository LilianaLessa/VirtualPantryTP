import { IBaseModule, TableBuilder } from "expo-sqlite-wrapper";
import { DocumentData } from "firebase/firestore";
import { IProduct } from "../interfaces/product.interface";
import {
  LocalTable,
  TableNames,
} from "../../../services/applicationData/localDatabase/tables";

export default class Product
  extends IBaseModule<TableNames>
  implements IProduct
{
  public name: string;

  public measureUnit: string;

  public packageWeight: number;

  public barCode: string;

  uuid: string;

  ownerUid?: string;

  firestoreCollectionName = Product.getFirestoreCollectionName();

  firestoreDeletedCollectionName = Product.getFirestoreDeletedCollectionName();

  firestoreId?: string;

  updatedAt?: string;

  constructor(
    uuid: string,
    barCode?: string,
    name?: string,
    measureUnit?: string,
    packageWeight?: number,
    id?: number,
    ownerUid?: string,
    updatedAt?: string,
    firestoreId?: string
  ) {
    super(LocalTable.PRODUCT);
    this.uuid = uuid;
    this.barCode = barCode ?? "";
    this.name = name ?? "";
    this.measureUnit = measureUnit ?? "";
    this.packageWeight = packageWeight ?? 1;
    if (typeof id !== "undefined") {
      this.id = id;
    }
    if (typeof ownerUid !== "undefined") {
      this.ownerUid = ownerUid;
    }
    if (typeof updatedAt !== "undefined") {
      this.updatedAt = updatedAt;
    }
    if (typeof firestoreId !== "undefined") {
      this.firestoreId = firestoreId;
    }
  }

  clone(override?: Partial<Product>): Product {
    return new Product(
      override?.uuid ?? this.uuid,
      override?.barCode ?? this.barCode,
      override?.name ?? this.name,
      override?.measureUnit ?? this.measureUnit,
      override?.packageWeight ?? this.packageWeight,
      override?.id ?? this.id,
      override?.ownerUid ?? this.ownerUid,
      override?.updatedAt ?? this.updatedAt,
      override?.firestoreId ?? this.firestoreId
    );
  }

  getKey(): string {
    return `product_${this.uuid}`;
  }

  static GetTableStructor() {
    return TableBuilder<Product, TableNames>(LocalTable.PRODUCT)
      .column("id")
      .primary.autoIncrement.number.column("uuid")
      .unique.string.column("barCode")
      .column("name")
      .column("measureUnit")
      .column("packageWeight")
      .column("ownerUid")
      .string.nullable.column("updatedAt")
      .string.nullable.column("firestoreId")
      .string.nullable.objectPrototype(Product.prototype);
  }

  static buildFromFirestoreData(doc: DocumentData): Product {
    return new Product(
      doc.data().uuid,
      doc.data().barCode,
      doc.data().name,
      doc.data().measureUnit,
      doc.data().packageWeight,
      undefined,
      doc.data().ownerUid,
      doc.data().updatedAt,
      doc.id
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

  static getFirestoreCollectionName(): string {
    return "product";
  }

  static getFirestoreDeletedCollectionName(): string {
    return "deleted_product";
  }
}
