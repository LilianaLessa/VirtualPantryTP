// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from "react";

export interface INotification {
  uuid: string;
  read: boolean;
  datetime: Date;

  getComponent: () => JSX.Element;
  getKey: () => string;
}
