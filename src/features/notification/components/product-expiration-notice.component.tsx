import React from "react";
import ProductExpirationNoticeNotification from "../classes/product-expiration-notice-notification.class";
import {
  ExpirationNoticeLeftIcon,
  NotificationContainer,
  NotificationDatetime,
  NotificationMessage,
  NotificationMessageContainer,
} from "./product-expiration-notice.styles";
import NotificationDeleteButton from "./notification-delete-button.component";

function ProductExpirationNotice({
  productExpirationNoticeNotification,
}: {
  productExpirationNoticeNotification: ProductExpirationNoticeNotification;
}) {
  const {
    datetime,
    storedProduct: { product },
    remainingDays,
  } = productExpirationNoticeNotification;

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
      <NotificationDeleteButton
        notification={productExpirationNoticeNotification}
      />
    </NotificationContainer>
  );
}

export default ProductExpirationNotice;
