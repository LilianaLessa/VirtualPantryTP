import React from "react";
import { TouchableOpacity } from "react-native";
import ProductExpirationNoticeNotification from "../classes/product-expiration-notice-notification.class";
import {
  ExpirationNoticeDeleteButtonIcon,
  ExpirationNoticeLeftIcon,
  NotificationContainer,
  NotificationDatetime,
  NotificationMessage,
  NotificationMessageContainer,
} from "./product-expiration-notice.styles";

function ProductExpirationNotice({
  productExpirationNoticeNotification: {
    datetime,
    storedProduct: { product },
    remainingDays,
  },
}: {
  productExpirationNoticeNotification: ProductExpirationNoticeNotification;
}) {
  const getMessage = () =>
    `The product '${product.name}' will expire in ${remainingDays} days.`;

  const getDatetimeString = () =>
    datetime.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <NotificationContainer>
      <ExpirationNoticeLeftIcon />
      <NotificationMessageContainer>
        <NotificationMessage>{getMessage()}</NotificationMessage>
        <NotificationDatetime>{getDatetimeString()}</NotificationDatetime>
      </NotificationMessageContainer>
      <TouchableOpacity>
        <ExpirationNoticeDeleteButtonIcon />
      </TouchableOpacity>
    </NotificationContainer>
  );
}

export default ProductExpirationNotice;
