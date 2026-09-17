import api from "@/lib/axios";
import { EndPoints } from "@/constants/end_points";
import type { Location } from "@/types/product";

interface LocationListResponse {
  items?: Location[];
}

export const locationService = {
  getAll: async (): Promise<Location[]> => {
    const { data } = await api.post(EndPoints.locationsList, { limit: 100 });
    const body = data as LocationListResponse | Location[];
    return Array.isArray(body) ? body : (body.items ?? []);
  },

  getById: async (id: string): Promise<Location> => {
    const { data } = await api.post(EndPoints.locationsGet, { id });
    return data as Location;
  },
};
