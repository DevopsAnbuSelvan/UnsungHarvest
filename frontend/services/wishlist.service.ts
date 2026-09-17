import api from "@/lib/axios";
import { EndPoints } from "@/constants/end_points";
import type { WishlistItem } from "@/types/cart";

export const wishlistService = {
  getAll: async (): Promise<WishlistItem[]> => {
    const { data } = await api.post(EndPoints.wishlistList);
    return (data as WishlistItem[]) ?? [];
  },

  add: async (productId: string): Promise<WishlistItem> => {
    const { data } = await api.post(EndPoints.wishlistAdd, { productId });
    return data as WishlistItem;
  },

  remove: async (productId: string): Promise<void> => {
    await api.post(EndPoints.wishlistRemove, { productId });
  },

  toggle: async (productId: string): Promise<{ added: boolean }> => {
    const list = await wishlistService.getAll();
    const exists = list.some((item) => item.productId === productId);
    if (exists) {
      await wishlistService.remove(productId);
      return { added: false };
    }
    await wishlistService.add(productId);
    return { added: true };
  },
};
