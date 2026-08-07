import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api";
import type { Order } from "@/types/order";
import type { PaginatedResponse, Product } from "@/types/product";

export interface CreateProductPayload {
  name: string;
  localName?: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  season: string[];
  isGiTagged: boolean;
  giTagNumber?: string;
  nutritionId?: string;
  availabilityMonths: number[];
  cultivationPlace?: string;
  locationId?: string;
}

export const sellerService = {
  getDashboard: async () => {
    const { data } = await api.get(API_ENDPOINTS.seller.dashboard);
    return data;
  },

  getProducts: async (page = 1): Promise<PaginatedResponse<Product>> => {
    const { data } = await api.get<PaginatedResponse<Product>>(
      API_ENDPOINTS.seller.products,
      { params: { page } }
    );
    return data;
  },

  getProduct: async (id: string): Promise<Product> => {
    const { data } = await api.get<Product>(
      API_ENDPOINTS.seller.product(id)
    );
    return data;
  },

  createProduct: async (
    payload: CreateProductPayload,
    images: File[]
  ): Promise<Product> => {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (value !== undefined) {
        formData.append(key, String(value));
      }
    });
    images.forEach((img) => formData.append("images", img));
    const { data } = await api.post<Product>(
      API_ENDPOINTS.seller.products,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data;
  },

  updateProduct: async (
    id: string,
    payload: Partial<CreateProductPayload>,
    images?: File[]
  ): Promise<Product> => {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (value !== undefined) {
        formData.append(key, String(value));
      }
    });
    images?.forEach((img) => formData.append("images", img));
    const { data } = await api.patch<Product>(
      API_ENDPOINTS.seller.product(id),
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(API_ENDPOINTS.seller.product(id));
  },

  getInventory: async () => {
    const { data } = await api.get(API_ENDPOINTS.seller.inventory);
    return data;
  },

  getOrders: async (page = 1): Promise<PaginatedResponse<Order>> => {
    const { data } = await api.get<PaginatedResponse<Order>>(
      API_ENDPOINTS.seller.orders,
      { params: { page } }
    );
    return data;
  },

  getAnalytics: async () => {
    const { data } = await api.get(API_ENDPOINTS.seller.analytics);
    return data;
  },

  getCustomers: async () => {
    const { data } = await api.get(API_ENDPOINTS.seller.customers);
    return data;
  },

  getProfile: async () => {
    const { data } = await api.get(API_ENDPOINTS.seller.profile);
    return data;
  },

  updateProfile: async (payload: Record<string, unknown>) => {
    const { data } = await api.patch(API_ENDPOINTS.seller.profile, payload);
    return data;
  },
};
