import api from "@/lib/axios";
import { EndPoints } from "@/constants/end_points";
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
  mapPendingProduct,
  mapPendingProductList,
  mapSellerList,
  mapSellerProfile,
  toBackendApprovalStatus,
} from "@/utils/admin";

export type CreateSellerPayload = {
  name: string;
  email: string;
  password: string;
  businessName: string;
  phone?: string;
  businessDescription?: string;
  commissionPercent?: number;
};

export type UpdateSellerPayload = {
  id: string;
  name?: string;
  phone?: string;
  businessName?: string;
  businessDescription?: string;
  gstNumber?: string;
  licenseNumber?: string;
  status?: string;
  commissionPercent?: number;
};

export type CreateBuyerPayload = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  bio?: string;
};

export type UpdateBuyerPayload = {
  id: string;
  name?: string;
  phone?: string;
  bio?: string;
  status?: string;
};

export type AdminCreateProductPayload = {
  name: string;
  localName?: string;
  description?: string;
  price: number;
  stock: number;
  categoryId: string;
  sellerId: string;
  seasonId?: string;
  nutritionId?: string;
  cultivationLocationId?: string;
  farmerId?: string;
  giStatus?: string;
};

export type AdminUpdateProductPayload = {
  id: string;
  name?: string;
  localName?: string;
  description?: string;
  price?: number;
  stock?: number;
  categoryId?: string;
  seasonId?: string;
  nutritionId?: string;
  cultivationLocationId?: string;
  farmerId?: string;
  giStatus?: string;
};

type BackendBuyerProfile = {
  id: string;
  userId: string;
  bio?: string;
  user?: {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    status?: string;
    createdAt?: string;
  };
};

function mapBuyerProfile(raw: BackendBuyerProfile): User {
  const name = raw.user?.name?.trim() || "";
  const parts = name.split(/\s+/);
  const status = (raw.user?.status || "active").toLowerCase();

  return {
    id: raw.userId || raw.user?.id || raw.id,
    email: raw.user?.email ?? "",
    firstName: parts[0] ?? "",
    lastName: parts.slice(1).join(" ") ?? "",
    role: "BUYER",
    phone: raw.user?.phone,
    isActive: status === "active",
    createdAt: raw.user?.createdAt ?? new Date().toISOString(),
  };
}

function mapBuyerList(raw: {
  items?: BackendBuyerProfile[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}): PaginatedResponse<User> {
  const items = raw.items ?? [];
  return {
    data: items.map(mapBuyerProfile),
    total: raw.total ?? items.length,
    page: raw.page ?? 1,
    limit: raw.limit ?? items.length,
    totalPages: raw.totalPages ?? 1,
  };
}

export const adminService = {
  getDashboard: async (): Promise<AdminDashboardStats> => {
    const { data } = await api.post<AdminDashboardStats>(
      EndPoints.adminDashboard
    );
    return data;
  },

  getSellers: async (
    status?: string,
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<SellerWithStatus>> => {
    const { data } = await api.post(EndPoints.sellersList, {
      page,
      limit,
      status: toBackendApprovalStatus(status),
    });
    return mapSellerList(data as Parameters<typeof mapSellerList>[0]);
  },

  getSeller: async (id: string): Promise<SellerWithStatus> => {
    const { data } = await api.post(EndPoints.sellersGet, { id });
    return mapSellerProfile(
      data as Parameters<typeof mapSellerProfile>[0]
    );
  },

  createSeller: async (payload: CreateSellerPayload): Promise<SellerWithStatus> => {
    const { data } = await api.post(EndPoints.sellersCreate, payload);
    return mapSellerProfile(
      data as Parameters<typeof mapSellerProfile>[0]
    );
  },

  updateSeller: async (payload: UpdateSellerPayload): Promise<SellerWithStatus> => {
    const { data } = await api.post(EndPoints.sellersUpdate, {
      ...payload,
      status: payload.status
        ? toBackendApprovalStatus(payload.status)
        : undefined,
    });
    return mapSellerProfile(
      data as Parameters<typeof mapSellerProfile>[0]
    );
  },

  deleteSeller: async (id: string): Promise<void> => {
    await api.post(EndPoints.sellersDelete, { id });
  },

  approveSeller: async (id: string): Promise<void> => {
    await api.post(EndPoints.sellersApprove, { id });
  },

  rejectSeller: async (id: string, reason?: string): Promise<void> => {
    await api.post(EndPoints.sellersReject, { id, rejectionReason: reason });
  },

  getBuyers: async (
    page = 1,
    limit = 10,
    search?: string
  ): Promise<PaginatedResponse<User>> => {
    const { data } = await api.post(EndPoints.buyersList, {
      page,
      limit,
      search,
    });
    return mapBuyerList(data as Parameters<typeof mapBuyerList>[0]);
  },

  createBuyer: async (payload: CreateBuyerPayload): Promise<User> => {
    const { data } = await api.post(EndPoints.buyersCreate, payload);
    return mapBuyerProfile(data as BackendBuyerProfile);
  },

  updateBuyer: async (payload: UpdateBuyerPayload): Promise<User> => {
    const { data } = await api.post(EndPoints.buyersUpdate, payload);
    return mapBuyerProfile(data as BackendBuyerProfile);
  },

  deleteBuyer: async (id: string): Promise<void> => {
    await api.post(EndPoints.buyersDelete, { id });
  },

  getProducts: async (
    status?: string,
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<PendingProduct>> => {
    const { data } = await api.post(EndPoints.productsList, {
      page,
      limit,
      status: toBackendApprovalStatus(status),
      sortBy: "createdAt",
      sortOrder: "DESC",
    });
    return mapPendingProductList(
      data as Parameters<typeof mapPendingProductList>[0]
    );
  },

  createProduct: async (
    payload: AdminCreateProductPayload,
    images: File[] = []
  ): Promise<PendingProduct> => {
    const { data } = await api.post(EndPoints.productsCreate, payload);
    const product = mapPendingProduct(
      data as Parameters<typeof mapPendingProduct>[0]
    );

    if (images.length > 0) {
      const formData = new FormData();
      formData.append("productId", product.id);
      images.forEach((img) => formData.append("files", img));
      await api.post(EndPoints.uploadsProductImages, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    return product;
  },

  updateProduct: async (
    payload: AdminUpdateProductPayload,
    images: File[] = []
  ): Promise<PendingProduct> => {
    const { data } = await api.post(EndPoints.productsUpdate, payload);
    const product = mapPendingProduct(
      data as Parameters<typeof mapPendingProduct>[0]
    );

    if (images.length > 0) {
      const formData = new FormData();
      formData.append("productId", payload.id);
      images.forEach((img) => formData.append("files", img));
      await api.post(EndPoints.uploadsProductImages, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    return product;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await api.post(EndPoints.productsDelete, { id });
  },

  approveProduct: async (id: string): Promise<void> => {
    await api.post(EndPoints.productsApprove, { id });
  },

  rejectProduct: async (id: string, reason?: string): Promise<void> => {
    await api.post(EndPoints.productsReject, { id, rejectionReason: reason });
  },

  getCategories: async (): Promise<Category[]> => {
    const { data } = await api.post(EndPoints.categoriesList, { limit: 100 });
    const body = data as { items?: Category[] } | Category[];
    return Array.isArray(body) ? body : (body.items ?? []);
  },

  createCategory: async (payload: Partial<Category>): Promise<Category> => {
    const { data } = await api.post<Category>(
      EndPoints.categoriesCreate,
      payload
    );
    return data;
  },

  updateCategory: async (
    id: string,
    payload: Partial<Category>
  ): Promise<Category> => {
    const { data } = await api.post<Category>(EndPoints.categoriesUpdate, {
      id,
      ...payload,
    });
    return data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await api.post(EndPoints.categoriesDelete, { id });
  },

  getSeasonCalendar: async (): Promise<SeasonCalendarEntry[]> => {
    const { data } = await api.post(EndPoints.seasonList, { limit: 100 });
    const body = data as
      | { items?: SeasonCalendarEntry[] }
      | SeasonCalendarEntry[];
    return Array.isArray(body) ? body : (body.items ?? []);
  },

  getSeasons: async (): Promise<
    {
      id: string;
      name: string;
      description?: string;
      startMonth?: number;
      endMonth?: number;
      isActive?: boolean;
    }[]
  > => {
    const { data } = await api.post(EndPoints.seasonList, { limit: 100 });
    const body = data as { items?: Array<Record<string, unknown>> };
    return (body.items ?? []) as Array<{
      id: string;
      name: string;
      description?: string;
      startMonth?: number;
      endMonth?: number;
      isActive?: boolean;
    }>;
  },

  createSeason: async (payload: {
    name: string;
    description?: string;
    startMonth?: number;
    endMonth?: number;
  }) => {
    const { data } = await api.post(EndPoints.seasonCreate, payload);
    return data;
  },

  updateSeason: async (payload: {
    id: string;
    name?: string;
    description?: string;
    startMonth?: number;
    endMonth?: number;
    isActive?: boolean;
  }) => {
    const { data } = await api.post(EndPoints.seasonUpdate, payload);
    return data;
  },

  deleteSeason: async (id: string): Promise<void> => {
    await api.post(EndPoints.seasonDelete, { id });
  },

  getNutrition: async (): Promise<NutritionInfo[]> => {
    const { data } = await api.post(EndPoints.nutritionList, { limit: 100 });
    const body = data as { items?: NutritionInfo[] } | NutritionInfo[];
    return Array.isArray(body) ? body : (body.items ?? []);
  },

  createNutrition: async (payload: Record<string, unknown>) => {
    const { data } = await api.post(EndPoints.nutritionCreate, payload);
    return data as NutritionInfo;
  },

  updateNutrition: async (payload: Record<string, unknown>) => {
    const { data } = await api.post(EndPoints.nutritionUpdate, payload);
    return data as NutritionInfo;
  },

  deleteNutrition: async (id: string): Promise<void> => {
    await api.post(EndPoints.nutritionDelete, { id });
  },

  getGiTags: async (): Promise<GiTagEntry[]> => {
    const { data } = await api.post(EndPoints.productsGiTagged, { limit: 100 });
    const body = data as GiTagEntry[] | { items?: GiTagEntry[] };
    if (Array.isArray(body)) return body;
    return (body.items ?? []).map((p) => ({
      id: (p as GiTagEntry).id,
      productName: (p as GiTagEntry).productName || (p as { name?: string }).name || "",
      tagNumber: (p as GiTagEntry).tagNumber || "GI",
      region: (p as GiTagEntry).region || "",
    }));
  },

  getLocations: async (): Promise<Location[]> => {
    const { data } = await api.post(EndPoints.locationsList, { limit: 100 });
    const body = data as { items?: Location[] } | Location[];
    return Array.isArray(body) ? body : (body.items ?? []);
  },

  createLocation: async (payload: {
    name: string;
    region?: string;
    state?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    description?: string;
  }) => {
    const { data } = await api.post(EndPoints.locationsCreate, payload);
    return data as Location;
  },

  updateLocation: async (payload: {
    id: string;
    name?: string;
    region?: string;
    state?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    description?: string;
    isActive?: boolean;
  }) => {
    const { data } = await api.post(EndPoints.locationsUpdate, payload);
    return data as Location;
  },

  deleteLocation: async (id: string): Promise<void> => {
    await api.post(EndPoints.locationsDelete, { id });
  },

  getOrders: async (page = 1): Promise<PaginatedResponse<Order>> => {
    const { data } = await api.post(EndPoints.ordersList, {
      page,
      limit: 10,
    });
    const body = data as {
      items?: Order[];
      data?: Order[];
      total?: number;
      page?: number;
      limit?: number;
      totalPages?: number;
    };
    const items = body.items ?? body.data ?? [];
    return {
      data: items,
      total: body.total ?? items.length,
      page: body.page ?? page,
      limit: body.limit ?? 10,
      totalPages: body.totalPages ?? 1,
    };
  },

  updateOrderStatus: async (id: string, status: string): Promise<void> => {
    await api.post(EndPoints.ordersUpdateStatus, {
      id,
      status: status.toLowerCase(),
    });
  },

  getPayments: async (page = 1) => {
    const { data } = await api.post(EndPoints.paymentsList, {
      page,
      limit: 10,
    });
    const body = data as {
      items?: Array<Record<string, unknown>>;
      total?: number;
      page?: number;
      limit?: number;
      totalPages?: number;
    };
    return {
      data: body.items ?? [],
      total: body.total ?? 0,
      page: body.page ?? page,
      limit: body.limit ?? 10,
      totalPages: body.totalPages ?? 1,
    };
  },

  confirmPayment: async (id: string): Promise<void> => {
    await api.post(EndPoints.paymentsConfirm, { id });
  },

  getReports: async (_period?: string): Promise<AdminReport> => {
    const { data } = await api.post(EndPoints.reportsSales);
    return data as AdminReport;
  },
};
