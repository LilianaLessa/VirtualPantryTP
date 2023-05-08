import AbstractNotification from "./abstract-notification.class";
import { IStoredProduct } from "../../products/interfaces/stored-product.interface";

export default class ProductExpirationNoticeNotification extends AbstractNotification {
  storedProduct: Partial<IStoredProduct>; // todo remove this Partial after testing.

  remainingDays: number;

  constructor(
    uuid: string,
    datetime: Date,
    read: boolean,
    storedProduct: Partial<IStoredProduct>,
    // eslint-disable-next-line comma-dangle
    remainingDays: number
  ) {
    super(uuid, datetime, read);
    this.storedProduct = storedProduct;
    this.remainingDays = remainingDays;
  }
}
