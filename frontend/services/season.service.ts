import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api";

export interface Season {
  id: string;
  name: string;
  description?: string;
  startMonth?: number;
  endMonth?: number;
}

interface SeasonListResponse {
  items?: Season[];
}

export const seasonService = {
  getAll: async (): Promise<Season[]> => {
    const { data } = await api.post<SeasonListResponse>(
      API_ENDPOINTS.season.list,
      { limit: 100 }
    );
    return data.items ?? [];
  },
};
