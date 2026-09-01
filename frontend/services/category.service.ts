import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api";
import type { Category } from "@/types/admin";

interface CategoryListResponse {
  items?: Category[];
  total?: number;
}

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const { data } = await api.post<CategoryListResponse>(
      API_ENDPOINTS.categories.list,
      { limit: 100, isActive: true }
    );
    return data.items ?? [];
  },

  getById: async (id: string): Promise<Category> => {
    const { data } = await api.post<Category>(
      API_ENDPOINTS.categories.get,
      { id }
    );
    return data;
  },
};
