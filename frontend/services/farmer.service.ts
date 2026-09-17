import api from "@/lib/axios";
import { EndPoints } from "@/constants/end_points";

export interface Farmer {
  id: string;
  name: string;
  phone?: string;
  village?: string;
  district?: string;
  state?: string;
  farmSize?: string;
  crops?: string;
  bio?: string;
  photoUrl?: string;
  sellerId: string;
  isActive: boolean;
  seller?: {
    id: string;
    businessName?: string;
    user?: { name?: string; email?: string };
  };
}

export type FarmerPayload = {
  name: string;
  phone?: string;
  village?: string;
  district?: string;
  state?: string;
  farmSize?: string;
  crops?: string;
  bio?: string;
  photoUrl?: string;
  /** Required for admin create */
  sellerId?: string;
};

interface FarmerListResponse {
  items?: Farmer[];
  data?: Farmer[];
}

export const farmerService = {
  list: async (opts?: {
    page?: number;
    limit?: number;
    sellerId?: string;
    search?: string;
  }): Promise<Farmer[]> => {
    const { data } = await api.post(EndPoints.farmersList, {
      page: opts?.page ?? 1,
      limit: opts?.limit ?? 50,
      sellerId: opts?.sellerId,
      search: opts?.search,
    });
    const body = data as FarmerListResponse | Farmer[];
    if (Array.isArray(body)) return body;
    return body.items ?? body.data ?? [];
  },

  getById: async (id: string): Promise<Farmer> => {
    const { data } = await api.post(EndPoints.farmersGet, { id });
    return data as Farmer;
  },

  create: async (payload: FarmerPayload): Promise<Farmer> => {
    const { data } = await api.post(EndPoints.farmersCreate, payload);
    return data as Farmer;
  },

  update: async (id: string, payload: FarmerPayload): Promise<Farmer> => {
    const { data } = await api.post(EndPoints.farmersUpdate, {
      id,
      ...payload,
    });
    return data as Farmer;
  },

  remove: async (id: string): Promise<void> => {
    await api.post(EndPoints.farmersDelete, { id });
  },
};
