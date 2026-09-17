import api from "@/lib/axios";
import { EndPoints } from "@/constants/end_points";

export type StaffUser = {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  status?: string;
  createdAt?: string;
  adminProfile?: { department?: string; permissions?: string[] };
};

export type StaffPayload = {
  name: string;
  email: string;
  password: string;
  department?: string;
};

export type StaffUpdatePayload = {
  id: string;
  name?: string;
  phone?: string;
  department?: string;
  status?: string;
};

type ListBody = {
  items?: StaffUser[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
};

function mapList(data: unknown, page: number, limit: number) {
  const body = data as ListBody;
  return {
    data: body.items ?? [],
    total: body.total ?? 0,
    page: body.page ?? page,
    limit: body.limit ?? limit,
    totalPages: body.totalPages ?? 1,
  };
}

/**
 * Super Cold Admin–only: manage regular Admin accounts.
 * (No Super Cold Admin CRUD — single owner account.)
 */
export const superColdAdminService = {
  listAdmins: async (page = 1, limit = 20) => {
    const { data } = await api.post(EndPoints.adminsList, { page, limit });
    return mapList(data, page, limit);
  },

  createAdmin: async (payload: StaffPayload) => {
    const { data } = await api.post(EndPoints.adminsCreate, payload);
    return data as StaffUser;
  },

  updateAdmin: async (payload: StaffUpdatePayload) => {
    const { data } = await api.post(EndPoints.adminsUpdate, payload);
    return data as StaffUser;
  },

  deleteAdmin: async (id: string): Promise<void> => {
    await api.post(EndPoints.adminsDelete, { id });
  },
};
