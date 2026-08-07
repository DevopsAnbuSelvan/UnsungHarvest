import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api";
import type { Order } from "@/types/order";
import type { PaginatedResponse, Product } from "@/types/product";

export const buyerService = {
  getDashboard: async () => {
    const { data } = await api.get(API_ENDPOINTS.buyer.dashboard);
    return data;
  },

  getProfile: async () => {
    const { data } = await api.get(API_ENDPOINTS.buyer.profile);
    return data;
  },

  updateProfile: async (payload: Record<string, unknown>) => {
    const { data } = await api.patch(API_ENDPOINTS.buyer.profile, payload);
    return data;
  },

  getOrders: async (page = 1): Promise<PaginatedResponse<Order>> => {
    const { data } = await api.get<PaginatedResponse<Order>>(
      API_ENDPOINTS.buyer.orders,
      { params: { page } }
    );
    return data;
  },

  getOrder: async (id: string): Promise<Order> => {
    const { data } = await api.get<Order>(
      API_ENDPOINTS.buyer.orderDetail(id)
    );
    return data;
  },
};
