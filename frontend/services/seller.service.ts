import api from "@/lib/axios";
import { EndPoints } from "@/constants/end_points";
import { mapPaginatedProducts, mapProduct } from "@/utils/product";
import type { Order } from "@/types/order";
import type { PaginatedResponse, Product } from "@/types/product";

export interface CreateProductPayload {
  name: string;
  localName?: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  seasonId?: string;
  isGiTagged: boolean;
  giTagNumber?: string;
  nutritionId?: string;
  availabilityMonths?: number[];
  cultivationPlace?: string;
  locationId?: string;
  farmerId?: string;
}

interface CreatedProduct {
  id: string;
  name: string;
}

interface SellerProfile {
  id: string;
}

const LIST_LIMIT = 10;

async function getSellerProfileId(): Promise<string> {
  const { data } = await api.post<SellerProfile>(EndPoints.sellersProfileGet);
  return data.id;
}

export const sellerService = {
  getDashboard: async () => {
    const { data } = await api.post(EndPoints.sellerDashboard);
    return data;
  },

  getProducts: async (page = 1): Promise<PaginatedResponse<Product>> => {
    const sellerId = await getSellerProfileId();
    const { data } = await api.post(EndPoints.productsList, {
      page,
      limit: LIST_LIMIT,
      sellerId,
      sortBy: "createdAt",
      sortOrder: "DESC",
    });
    return mapPaginatedProducts(data as Parameters<typeof mapPaginatedProducts>[0]);
  },

  getProduct: async (id: string): Promise<Product> => {
    const { data } = await api.post(EndPoints.productsGet, { id });
    return mapProduct(data as Parameters<typeof mapProduct>[0]);
  },

  createProduct: async (
    payload: CreateProductPayload,
    images: File[]
  ): Promise<CreatedProduct> => {
    const { data: product } = await api.post<CreatedProduct>(
      EndPoints.productsCreate,
      {
        name: payload.name,
        localName: payload.localName || undefined,
        description: payload.description,
        price: Number(payload.price),
        stock: Number(payload.stock),
        categoryId: payload.categoryId,
        seasonId: payload.seasonId || undefined,
        giStatus: payload.isGiTagged ? "registered" : "not_applicable",
        nutritionId: payload.nutritionId || undefined,
        cultivationLocationId: payload.locationId || undefined,
        farmerId: payload.farmerId || undefined,
      }
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
    id: string,
    payload: Partial<CreateProductPayload>,
    images?: File[]
  ): Promise<Product> => {
    const { data: product } = await api.post<Product>(
      EndPoints.productsUpdate,
      {
        id,
        name: payload.name,
        localName: payload.localName || undefined,
        description: payload.description,
        price: payload.price !== undefined ? Number(payload.price) : undefined,
        stock: payload.stock !== undefined ? Number(payload.stock) : undefined,
        categoryId: payload.categoryId,
        seasonId: payload.seasonId || undefined,
        giStatus: payload.isGiTagged ? "registered" : "not_applicable",
        nutritionId: payload.nutritionId || undefined,
        cultivationLocationId: payload.locationId || undefined,
        farmerId: payload.farmerId || undefined,
      }
    );

    if (images?.length) {
      const formData = new FormData();
      formData.append("productId", id);
      images.forEach((img) => formData.append("files", img));
      await api.post(EndPoints.uploadsProductImages, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    return mapProduct(product as Parameters<typeof mapProduct>[0]);
  },

  deleteProduct: async (id: string): Promise<void> => {
    await api.post(EndPoints.productsDelete, { id });
  },

  getInventory: async () => {
    const sellerId = await getSellerProfileId();
    const { data } = await api.post(EndPoints.sellerInventory, {
      page: 1,
      limit: 100,
      sellerId,
      sortBy: "createdAt",
      sortOrder: "DESC",
    });
    return data;
  },

  getOrders: async (page = 1): Promise<PaginatedResponse<Order>> => {
    const { data } = await api.post(EndPoints.sellerOrders, { page });
    return data as PaginatedResponse<Order>;
  },

  getAnalytics: async () => {
    const { data } = await api.post(EndPoints.sellerAnalytics);
    return data;
  },

  getCustomers: async () => {
    const { data } = await api.post(EndPoints.sellerCustomers, { limit: 50 });
    return data;
  },

  getProfile: async () => {
    const { data } = await api.post(EndPoints.sellersProfileGet);
    return data;
  },

  updateProfile: async (payload: Record<string, unknown>) => {
    const { data } = await api.post(EndPoints.sellersProfileUpdate, payload);
    return data;
  },
};
