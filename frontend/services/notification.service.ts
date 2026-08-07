import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api";
import type { Notification } from "@/types/notification";

export const notificationService = {
  getAll: async (): Promise<Notification[]> => {
    const { data } = await api.get<Notification[]>(
      API_ENDPOINTS.notifications
    );
    return data;
  },

  markAsRead: async (id: string): Promise<void> => {
    await api.patch(`${API_ENDPOINTS.notifications}/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await api.patch(`${API_ENDPOINTS.notifications}/read-all`);
  },

  getUnreadCount: async (): Promise<number> => {
    const { data } = await api.get<{ count: number }>(
      `${API_ENDPOINTS.notifications}/unread-count`
    );
    return data.count;
  },
};
