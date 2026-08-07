import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api";
import type { Cart } from "@/types/cart";

export const cartService = {
  getCart: async (): Promise<Cart> => {
    const { data } = await api.get<Cart>(API_ENDPOINTS.cart);
    return data;
  },

  addItem: async (productId: string, quantity = 1): Promise<Cart> => {
    const { data } = await api.post<Cart>(API_ENDPOINTS.cart, {
      productId,
      quantity,
    });
    return data;
  },

  updateItem: async (itemId: string, quantity: number): Promise<Cart> => {
    const { data } = await api.patch<Cart>(
      `${API_ENDPOINTS.cart}/${itemId}`,
      { quantity }
    );
    return data;
  },

  removeItem: async (itemId: string): Promise<Cart> => {
    const { data } = await api.delete<Cart>(
      `${API_ENDPOINTS.cart}/${itemId}`
    );
    return data;
  },

  applyCoupon: async (code: string): Promise<Cart> => {
    const { data } = await api.post<Cart>(`${API_ENDPOINTS.cart}/coupon`, {
      code,
    });
    return data;
  },

  clearCart: async (): Promise<void> => {
    await api.delete(API_ENDPOINTS.cart);
  },
};
