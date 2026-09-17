import api from "@/lib/axios";
import { EndPoints } from "@/constants/end_points";
import type { Cart } from "@/types/cart";

export const cartService = {
  getCart: async (): Promise<Cart> => {
    const { data } = await api.post<Cart>(EndPoints.cartGet);
    return data;
  },

  addItem: async (productId: string, quantity = 1): Promise<Cart> => {
    const { data } = await api.post<Cart>(EndPoints.cartAdd, {
      productId,
      quantity,
    });
    return data;
  },

  updateItem: async (itemId: string, quantity: number): Promise<Cart> => {
    const { data } = await api.post<Cart>(EndPoints.cartUpdate, {
      id: itemId,
      quantity,
    });
    return data;
  },

  removeItem: async (itemId: string): Promise<Cart> => {
    const { data } = await api.post<Cart>(EndPoints.cartRemove, { id: itemId });
    return data;
  },

  applyCoupon: async (_code: string): Promise<Cart> => {
    // Coupon not implemented on backend yet — return current cart
    return cartService.getCart();
  },

  clearCart: async (): Promise<void> => {
    await api.post(EndPoints.cartClear);
  },
};
