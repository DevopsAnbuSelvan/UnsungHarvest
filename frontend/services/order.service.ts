import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api";
import type { CheckoutPayload, Order } from "@/types/order";
import type { PaginatedResponse } from "@/types/product";

export const orderService = {
  getAll: async (page = 1): Promise<PaginatedResponse<Order>> => {
    const { data } = await api.get<PaginatedResponse<Order>>(
      API_ENDPOINTS.orders,
      { params: { page } }
    );
    return data;
  },

  getById: async (id: string): Promise<Order> => {
    const { data } = await api.get<Order>(`${API_ENDPOINTS.orders}/${id}`);
    return data;
  },

  checkout: async (payload: CheckoutPayload): Promise<Order> => {
    const { data } = await api.post<Order>(
      `${API_ENDPOINTS.orders}/checkout`,
      payload
    );
    return data;
  },

  cancel: async (id: string): Promise<Order> => {
    const { data } = await api.patch<Order>(
      `${API_ENDPOINTS.orders}/${id}/cancel`
    );
    return data;
  },
};
