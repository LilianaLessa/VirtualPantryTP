// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useContext, useEffect, useState } from "react";
import {
  ExpirationNoticeLeftIcon,
  NotificationContainer,
  NotificationDatetime,
  NotificationMessage,
  NotificationMessageContainer,
  UnreadNotificationContainer,
} from "./product-expiration-notice.styles";
import NotificationDeleteButton from "../notification-delete-button.component";
import Notification from "../../classes/notification.class";
import { DependencyInjectionContext } from "../../../../services/dependencyInjection/dependency-injection.context";

function ProductExpirationNotice({
  notification,
}: {
  notification: Notification;
}) {
  const {
    productService,
    pantryService,
    navigationService,
    notificationService,
  } = useContext(DependencyInjectionContext);
  const {
    data: { storedProductUuid, remainingDays },
    createdAt,
  } = notification;

  const [storedProduct, setStoredProduct] = useState(
    pantryService.getStoredProductByUuid(storedProductUuid)
  );

  useEffect(() => {
    setStoredProduct(pantryService.getStoredProductByUuid(storedProductUuid));
  }, [pantryService]);

  function getExpirationMessage(remaining: number) {
    if (remaining === 0) {
      return "will expire today.";
    }

    if (remaining < 0) {
      return `expired ${Math.abs(remaining)} days ago.`;
    }

    if (remaining === 1) {
      return "will expire tomorrow.";
    }

    return `will expire in ${remaining} days.`;
  }

  const getMessage = () => {
    const displayName = pantryService.getStoredProductDisplayName(
      storedProduct,
      productService.getProductByUuid(storedProduct?.productUuid)
    );
    const pantry = pantryService.getPantryByUuid(storedProduct?.pantryUuid);
    const expirationMessage = getExpirationMessage(remainingDays);

    return `The product '${displayName ?? "<not found>"}' at '${
      pantry?.name ?? "<not found>"
    }' ${expirationMessage}`;
  };

  const getDatetimeString = () =>
    new Date(createdAt).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    });

  const goToPantry = () => {
    const pantry = pantryService.getPantryByUuid(storedProduct?.pantryUuid);
    if (pantry) {
      // todo on coming from notification, add flash to item.
      navigationService.showPantryContentScreen(pantry);
    }
  };

  const Container = notification.read
    ? NotificationContainer
    : UnreadNotificationContainer;

  const toggleRead = () => {
    notificationService.saveNotification(
      notification.clone({
        read: !notification.read,
      })
    );
  };

  return (
    <Container onLongPress={goToPantry} onPress={toggleRead}>
      <ExpirationNoticeLeftIcon />
      <NotificationMessageContainer>
        <NotificationMessage>{getMessage()}</NotificationMessage>
        <NotificationDatetime>{getDatetimeString()}</NotificationDatetime>
      </NotificationMessageContainer>
      <NotificationDeleteButton notification={notification} />
    </Container>
  );
}

export default ProductExpirationNotice;
