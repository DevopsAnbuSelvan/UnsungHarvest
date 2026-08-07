import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api";
import type { WishlistItem } from "@/types/cart";

export const wishlistService = {
  getAll: async (): Promise<WishlistItem[]> => {
    const { data } = await api.get<WishlistItem[]>(API_ENDPOINTS.wishlist);
    return data;
  },

  add: async (productId: string): Promise<WishlistItem> => {
    const { data } = await api.post<WishlistItem>(API_ENDPOINTS.wishlist, {
      productId,
    });
    return data;
  },

  remove: async (productId: string): Promise<void> => {
    await api.delete(`${API_ENDPOINTS.wishlist}/${productId}`);
  },

  toggle: async (productId: string): Promise<{ added: boolean }> => {
    const { data } = await api.post<{ added: boolean }>(
      `${API_ENDPOINTS.wishlist}/toggle`,
      { productId }
    );
    return data;
  },
};
