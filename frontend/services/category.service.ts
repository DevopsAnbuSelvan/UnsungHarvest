import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api";
import type { Category } from "@/types/admin";

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const { data } = await api.get<Category[]>(API_ENDPOINTS.categories);
    return data;
  },

  getById: async (id: string): Promise<Category> => {
    const { data } = await api.get<Category>(
      `${API_ENDPOINTS.categories}/${id}`
    );
    return data;
  },
};
