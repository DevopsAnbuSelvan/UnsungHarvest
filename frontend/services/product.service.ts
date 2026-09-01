import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api";
import {
  mapPaginatedProducts,
  mapProduct,
  mapProductList,
} from "@/utils/product";
import type {
  PaginatedResponse,
  Product,
  ProductFilters,
  Review,
} from "@/types/product";

const LIST_LIMIT = 12;

async function fetchProductList(endpoint: string, limit = LIST_LIMIT): Promise<Product[]> {
  const { data } = await api.post<unknown[]>(endpoint, { limit });
  return mapProductList((data as Parameters<typeof mapProductList>[0]) ?? []);
}

export const productService = {
  getAll: async (
    filters?: ProductFilters
  ): Promise<PaginatedResponse<Product>> => {
    const { data } = await api.post(API_ENDPOINTS.products.list, {
      page: filters?.page ?? 1,
      limit: filters?.limit ?? LIST_LIMIT,
      ...(filters?.search ? { search: filters.search } : {}),
      ...(filters?.categoryId ? { categoryId: filters.categoryId } : {}),
      sortBy: filters?.sortBy,
      sortOrder: filters?.sortOrder?.toUpperCase(),
      status: "approved",
    });
    return mapPaginatedProducts(data as Parameters<typeof mapPaginatedProducts>[0]);
  },

  getFeatured: async (): Promise<Product[]> => {
    return fetchProductList(API_ENDPOINTS.products.featured);
  },

  getTrending: async (): Promise<Product[]> => {
    return fetchProductList(API_ENDPOINTS.products.trending);
  },

  getRecent: async (): Promise<Product[]> => {
    return fetchProductList(API_ENDPOINTS.products.recent);
  },

  getSeasonal: async (): Promise<Product[]> => {
    return fetchProductList(API_ENDPOINTS.products.seasonal);
  },

  getGiTagged: async (): Promise<Product[]> => {
    return fetchProductList(API_ENDPOINTS.products.giTagged);
  },

  getById: async (id: string): Promise<Product> => {
    const { data } = await api.post(API_ENDPOINTS.products.get, { id });
    return mapProduct(data as Parameters<typeof mapProduct>[0]);
  },

  getReviews: async (id: string): Promise<Review[]> => {
    const { data } = await api.get<Review[]>(`/products/${id}/reviews`);
    return data;
  },

  getRelated: async (id: string): Promise<Product[]> => {
    const { data } = await api.get<Product[]>(`/products/${id}/related`);
    return mapProductList((data as Parameters<typeof mapProductList>[0]) ?? []);
  },

  search: async (query: string): Promise<Product[]> => {
    const { data } = await api.post(API_ENDPOINTS.products.search, {
      search: query,
      limit: LIST_LIMIT,
      status: "approved",
    });
    const paginated = mapPaginatedProducts(
      data as Parameters<typeof mapPaginatedProducts>[0]
    );
    return paginated.data;
  },
};
