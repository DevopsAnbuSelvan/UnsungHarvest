import api from "@/lib/axios";
import { EndPoints } from "@/constants/end_points";
import type { Order } from "@/types/order";
import type { PaginatedResponse } from "@/types/product";

export const buyerService = {
  getDashboard: async () => {
    const { data } = await api.post(EndPoints.buyerDashboard);
    return data;
  },

  getProfile: async () => {
    const { data } = await api.post(EndPoints.buyersProfileGet);
    return data;
  },

  updateProfile: async (payload: Record<string, unknown>) => {
    const { data } = await api.post(EndPoints.buyersProfileUpdate, payload);
    return data;
  },

  getOrders: async (page = 1): Promise<PaginatedResponse<Order>> => {
    const { data } = await api.post(EndPoints.ordersMyOrders, { page });
    return data;
  },

  getOrder: async (id: string): Promise<Order> => {
    const { data } = await api.post(EndPoints.ordersGet, { id });
    return data as Order;
  },
};
