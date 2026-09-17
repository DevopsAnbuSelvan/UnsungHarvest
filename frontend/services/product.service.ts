import api from "@/lib/axios";
import { EndPoints } from "@/constants/end_points";
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
    const { data } = await api.post(EndPoints.productsList, {
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
    return fetchProductList(EndPoints.productsFeatured);
  },

  getTrending: async (): Promise<Product[]> => {
    return fetchProductList(EndPoints.productsTrending);
  },

  getRecent: async (): Promise<Product[]> => {
    return fetchProductList(EndPoints.productsRecent);
  },

  getSeasonal: async (): Promise<Product[]> => {
    return fetchProductList(EndPoints.productsSeasonal);
  },

  getGiTagged: async (): Promise<Product[]> => {
    return fetchProductList(EndPoints.productsGiTagged);
  },

  getById: async (id: string): Promise<Product> => {
    const { data } = await api.post(EndPoints.productsGet, { id });
    return mapProduct(data as Parameters<typeof mapProduct>[0]);
  },

  getReviews: async (_id: string): Promise<Review[]> => {
    // Reviews endpoint not implemented — return empty until products_reviews_api exists
    return [];
  },

  getRelated: async (id: string): Promise<Product[]> => {
    const product = await productService.getById(id);
    const { data } = await api.post(EndPoints.productsList, {
      categoryId: product.categoryId,
      limit: 8,
      status: "approved",
    });
    const paginated = mapPaginatedProducts(
      data as Parameters<typeof mapPaginatedProducts>[0]
    );
    return paginated.data.filter((p) => p.id !== id);
  },

  search: async (query: string): Promise<Product[]> => {
    const { data } = await api.post(EndPoints.productsList, {
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
