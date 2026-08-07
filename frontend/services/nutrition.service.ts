import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api";
import type { NutritionInfo } from "@/types/product";

export const nutritionService = {
  getAll: async (): Promise<NutritionInfo[]> => {
    const { data } = await api.get<NutritionInfo[]>(API_ENDPOINTS.nutrition);
    return data;
  },

  getById: async (id: string): Promise<NutritionInfo> => {
    const { data } = await api.get<NutritionInfo>(
      `${API_ENDPOINTS.nutrition}/${id}`
    );
    return data;
  },
};
