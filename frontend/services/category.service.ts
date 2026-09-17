import api from "@/lib/axios";
import { EndPoints } from "@/constants/end_points";
import type { Category } from "@/types/admin";

interface CategoryListResponse {
  items?: Category[];
  total?: number;
}

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const { data } = await api.post<CategoryListResponse>(
      EndPoints.categoriesList,
      { limit: 100, isActive: true }
    );
    return data.items ?? [];
  },

  getById: async (id: string): Promise<Category> => {
    const { data } = await api.post<Category>(
      EndPoints.categoriesGet,
      { id }
    );
    return data;
  },
};
