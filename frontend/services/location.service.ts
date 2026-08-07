import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api";
import type { Location } from "@/types/product";

export const locationService = {
  getAll: async (): Promise<Location[]> => {
    const { data } = await api.get<Location[]>(API_ENDPOINTS.locations);
    return data;
  },

  getById: async (id: string): Promise<Location> => {
    const { data } = await api.get<Location>(
      `${API_ENDPOINTS.locations}/${id}`
    );
    return data;
  },
};
