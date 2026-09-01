import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api";
import type { NutritionInfo } from "@/types/product";

interface NutritionListResponse {
  items?: NutritionInfo[];
  total?: number;
}

export const nutritionService = {
  getAll: async (): Promise<NutritionInfo[]> => {
    const { data } = await api.post<NutritionListResponse>(
      API_ENDPOINTS.nutrition.list,
      { limit: 100 }
    );
    return data.items ?? [];
  },

  getById: async (id: string): Promise<NutritionInfo> => {
    const { data } = await api.post<NutritionInfo>(
      API_ENDPOINTS.nutrition.get,
      { id }
    );
    return data;
  },
};
