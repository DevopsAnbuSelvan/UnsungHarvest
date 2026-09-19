import api from "@/lib/axios";
import { EndPoints } from "@/constants/end_points";
import { mapOrder } from "@/utils/order";
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
    const { data } = await api.post(EndPoints.ordersMyOrders, {
      page,
      limit: 10,
    });
    const body = data as {
      items?: unknown[];
      data?: unknown[];
      total?: number;
      page?: number;
      limit?: number;
      totalPages?: number;
    };
    const rawItems = body.items ?? body.data ?? [];
    const items = rawItems.map((row) =>
      mapOrder(row as Parameters<typeof mapOrder>[0])
    );
    return {
      data: items,
      total: body.total ?? items.length,
      page: body.page ?? page,
      limit: body.limit ?? 10,
      totalPages: body.totalPages ?? 1,
    };
  },

  getOrder: async (id: string): Promise<Order> => {
    const { data } = await api.post(EndPoints.ordersGet, { id });
    return mapOrder(data as Parameters<typeof mapOrder>[0]);
  },
};
