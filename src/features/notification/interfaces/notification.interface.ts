export interface INotification {
  uuid: string;
  read: boolean;
  datetime: Date;

  getKey: () => string;
}
