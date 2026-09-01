import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api";
import type {
  AdminDashboardStats,
  AdminReport,
  Category,
  GiTagEntry,
  PendingProduct,
  SeasonCalendarEntry,
  SellerWithStatus,
} from "@/types/admin";
import type { Order } from "@/types/order";
import type { NutritionInfo } from "@/types/product";
import type { Location } from "@/types/product";
import type { PaginatedResponse } from "@/types/product";
import type { User } from "@/types/auth";
import {
  mapPendingProductList,
  mapSellerList,
  toBackendApprovalStatus,
} from "@/utils/admin";

export const adminService = {
  getDashboard: async (): Promise<AdminDashboardStats> => {
    const { data } = await api.get<AdminDashboardStats>(
      API_ENDPOINTS.admin.dashboard
    );
    return data;
  },

  getSellers: async (
    status?: string,
    page = 1
  ): Promise<PaginatedResponse<SellerWithStatus>> => {
    const { data } = await api.post(API_ENDPOINTS.sellers.list, {
      page,
      limit: 10,
      status: toBackendApprovalStatus(status),
    });
    return mapSellerList(data as Parameters<typeof mapSellerList>[0]);
  },

  approveSeller: async (id: string): Promise<void> => {
    await api.post(API_ENDPOINTS.sellers.approve, { id });
  },

  rejectSeller: async (id: string, reason?: string): Promise<void> => {
    await api.post(API_ENDPOINTS.sellers.reject, { id, rejectionReason: reason });
  },

  getBuyers: async (): Promise<PaginatedResponse<User>> => {
    const { data } = await api.get<PaginatedResponse<User>>(
      API_ENDPOINTS.admin.buyers
    );
    return data;
  },

  getProducts: async (
    status?: string,
    page = 1
  ): Promise<PaginatedResponse<PendingProduct>> => {
    const { data } = await api.post(API_ENDPOINTS.products.list, {
      page,
      limit: 10,
      status: toBackendApprovalStatus(status),
      sortBy: "createdAt",
      sortOrder: "DESC",
    });
    return mapPendingProductList(data as Parameters<typeof mapPendingProductList>[0]);
  },

  approveProduct: async (id: string): Promise<void> => {
    await api.post(API_ENDPOINTS.products.approve, { id });
  },

  rejectProduct: async (id: string, reason?: string): Promise<void> => {
    await api.post(API_ENDPOINTS.products.reject, { id, rejectionReason: reason });
  },

  getCategories: async (): Promise<Category[]> => {
    const { data } = await api.get<Category[]>(API_ENDPOINTS.admin.categories);
    return data;
  },

  createCategory: async (payload: Partial<Category>): Promise<Category> => {
    const { data } = await api.post<Category>(
      API_ENDPOINTS.admin.categories,
      payload
    );
    return data;
  },

  updateCategory: async (
    id: string,
    payload: Partial<Category>
  ): Promise<Category> => {
    const { data } = await api.patch<Category>(
      `${API_ENDPOINTS.admin.categories}/${id}`,
      payload
    );
    return data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`${API_ENDPOINTS.admin.categories}/${id}`);
  },

  getSeasonCalendar: async (): Promise<SeasonCalendarEntry[]> => {
    const { data } = await api.get<SeasonCalendarEntry[]>(
      API_ENDPOINTS.admin.seasonCalendar
    );
    return data;
  },

  getNutrition: async (): Promise<NutritionInfo[]> => {
    const { data } = await api.get<NutritionInfo[]>(
      API_ENDPOINTS.admin.nutrition
    );
    return data;
  },

  getGiTags: async (): Promise<GiTagEntry[]> => {
    const { data } = await api.get<GiTagEntry[]>(API_ENDPOINTS.admin.giTags);
    return data;
  },

  getLocations: async (): Promise<Location[]> => {
    const { data } = await api.get<Location[]>(API_ENDPOINTS.admin.locations);
    return data;
  },

  getOrders: async (page = 1): Promise<PaginatedResponse<Order>> => {
    const { data } = await api.get<PaginatedResponse<Order>>(
      API_ENDPOINTS.admin.orders,
      { params: { page } }
    );
    return data;
  },

  getReports: async (period?: string): Promise<AdminReport> => {
    const { data } = await api.get<AdminReport>(API_ENDPOINTS.admin.reports, {
      params: { period },
    });
    return data;
  },
};
