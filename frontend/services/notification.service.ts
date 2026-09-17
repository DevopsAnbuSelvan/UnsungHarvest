import api from "@/lib/axios";
import { EndPoints } from "@/constants/end_points";
import type { Notification } from "@/types/notification";

export const notificationService = {
  getAll: async (): Promise<Notification[]> => {
    const { data } = await api.post(EndPoints.notificationsList);
    return (data as Notification[]) ?? [];
  },

  markAsRead: async (id: string): Promise<void> => {
    await api.post(EndPoints.notificationsMarkRead, { id });
  },

  markAllAsRead: async (): Promise<void> => {
    await api.post(EndPoints.notificationsMarkAllRead);
  },

  getUnreadCount: async (): Promise<number> => {
    const list = await notificationService.getAll();
    return list.filter((n) => !n.isRead).length;
  },
};
