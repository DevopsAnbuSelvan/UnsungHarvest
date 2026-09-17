import api from "@/lib/axios";
import { EndPoints } from "@/constants/end_points";

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
      EndPoints.seasonList,
      { limit: 100 }
    );
    return data.items ?? [];
  },
};
