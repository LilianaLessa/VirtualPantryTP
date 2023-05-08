import React from "react";
import AbstractNotification from "./abstract-notification.class";
import { IStoredProduct } from "../../products/interfaces/stored-product.interface";
import ProductExpirationNotice from "../components/product-expiration-notice.component";

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

  getComponent(): JSX.Element {
    return (
      <ProductExpirationNotice productExpirationNoticeNotification={this} />
    );
  }
}
