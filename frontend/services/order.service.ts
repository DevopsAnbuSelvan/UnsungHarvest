import api from "@/lib/axios";
import { EndPoints } from "@/constants/end_points";
import type { CheckoutPayload, Order } from "@/types/order";
import type { PaginatedResponse } from "@/types/product";

export const orderService = {
  getAll: async (page = 1): Promise<PaginatedResponse<Order>> => {
    const { data } = await api.post(EndPoints.ordersMyOrders, { page });
    return data;
  },

  getById: async (id: string): Promise<Order> => {
    const { data } = await api.post(EndPoints.ordersGet, { id });
    return data as Order;
  },

  checkout: async (payload: CheckoutPayload): Promise<Order> => {
    const { data } = await api.post<Order>(EndPoints.ordersCreate, payload);
    return data;
  },

  cancel: async (id: string): Promise<Order> => {
    const { data } = await api.post(EndPoints.ordersUpdateStatus, {
      id,
      status: "cancelled",
    });
    return data as Order;
  },
};
