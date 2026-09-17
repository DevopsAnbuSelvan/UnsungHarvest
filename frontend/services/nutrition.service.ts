import api from "@/lib/axios";
import { EndPoints } from "@/constants/end_points";
import type { NutritionInfo } from "@/types/product";

interface NutritionListResponse {
  items?: NutritionInfo[];
  total?: number;
}

export const nutritionService = {
  getAll: async (): Promise<NutritionInfo[]> => {
    const { data } = await api.post<NutritionListResponse>(
      EndPoints.nutritionList,
      { limit: 100 }
    );
    return data.items ?? [];
  },

  getById: async (id: string): Promise<NutritionInfo> => {
    const { data } = await api.post<NutritionInfo>(
      EndPoints.nutritionGet,
      { id }
    );
    return data;
  },
};
