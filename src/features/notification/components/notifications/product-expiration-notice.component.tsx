import React, { useContext, useEffect, useState } from "react";
import {
  ExpirationNoticeLeftIcon,
  NotificationContainer,
  NotificationDatetime,
  NotificationMessage,
  NotificationMessageContainer,
} from "./product-expiration-notice.styles";
import NotificationDeleteButton from "../notification-delete-button.component";
import Notification from "../../classes/notification.class";
import { DependencyInjectionContext } from "../../../../services/dependencyInjection/dependency-injection.context";

function ProductExpirationNotice({
  notification,
}: {
  notification: Notification;
}) {
  const { pantryService, navigationService } = useContext(
    DependencyInjectionContext
  );
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

  const getMessage = () =>
    `The product '${
      storedProduct?.name ?? "<not found>"
    }' will expire in ${remainingDays} days.`;

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

  return (
    <NotificationContainer onPress={goToPantry}>
      <ExpirationNoticeLeftIcon />
      <NotificationMessageContainer>
        <NotificationMessage>{getMessage()}</NotificationMessage>
        <NotificationDatetime>{getDatetimeString()}</NotificationDatetime>
      </NotificationMessageContainer>
      <NotificationDeleteButton notification={notification} />
    </NotificationContainer>
  );
}

export default ProductExpirationNotice;
