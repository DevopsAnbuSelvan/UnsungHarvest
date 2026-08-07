export type NotificationType =
  | "ORDER"
  | "PRODUCT"
  | "SELLER"
  | "SYSTEM"
  | "PROMOTION";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  link?: string;
  createdAt: string;
}
