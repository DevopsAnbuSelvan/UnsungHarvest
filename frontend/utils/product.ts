import type { Product, PaginatedResponse } from "@/types/product";
import { resolveImageUrl } from "@/lib/utils";

type BackendProductImage = { imageUrl?: string; url?: string };
type BackendSeason = { name?: string };
type BackendSeller = {
  id?: string;
  businessName?: string;
  user?: { name?: string };
};
type BackendLocation = {
  id?: string;
  name?: string;
  state?: string;
  district?: string;
  latitude?: number;
  longitude?: number;
};
type BackendProduct = {
  id: string;
  name: string;
  localName?: string;
  description?: string;
  price: number | string;
  stock: number;
  categoryId?: string;
  category?: { id: string; name: string };
  sellerId?: string;
  seller?: BackendSeller;
  images?: BackendProductImage[] | string[];
  season?: BackendSeason | string[] | null;
  giStatus?: string;
  isGiTagged?: boolean;
  cultivationLocation?: BackendLocation;
  location?: BackendLocation;
  nutrition?: Product["nutrition"];
  status?: string;
  createdAt?: string;
  updatedAt?: string;
};

function parseImages(images?: BackendProductImage[] | string[]): string[] {
  if (!images?.length) return [];
  const urls =
    typeof images[0] === "string"
      ? (images as string[])
      : (images as BackendProductImage[])
          .map((img) => img.imageUrl || img.url || "")
          .filter(Boolean);
  return urls.map((url) => resolveImageUrl(url));
}

function parseSeason(season?: BackendProduct["season"]): string[] {
  if (!season) return [];
  if (Array.isArray(season)) return season;
  return season.name ? [season.name] : [];
}

export function mapProduct(raw: BackendProduct): Product {
  const location = raw.cultivationLocation || raw.location;
  const seller = raw.seller;
  const sellerName = seller?.user?.name?.trim() || "";
  const nameParts = sellerName.split(/\s+/);

  return {
    id: raw.id,
    name: raw.name,
    localName: raw.localName,
    description: raw.description || "",
    price: Number(raw.price),
    stock: raw.stock,
    images: parseImages(raw.images),
    categoryId: raw.categoryId || raw.category?.id || "",
    category: raw.category,
    sellerId: raw.sellerId || seller?.id || "",
    seller: seller
      ? {
          id: seller.id || "",
          firstName: nameParts[0] || "",
          lastName: nameParts.slice(1).join(" ") || "",
          farmName: seller.businessName,
        }
      : undefined,
    location: location
      ? {
          id: location.id || "",
          name: location.name || "",
          state: location.state || "",
          district: location.district,
          latitude: location.latitude,
          longitude: location.longitude,
        }
      : undefined,
    season: parseSeason(raw.season),
    isGiTagged:
      raw.isGiTagged === true ||
      raw.giStatus === "registered" ||
      raw.giStatus === "REGISTERED",
    nutrition: raw.nutrition,
    status: (raw.status?.toUpperCase() as Product["status"]) || "APPROVED",
    availabilityMonths: [],
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || new Date().toISOString(),
  };
}

export function mapProductList(raw: BackendProduct[]): Product[] {
  return raw.map(mapProduct);
}

export function mapPaginatedProducts(
  raw: {
    items?: BackendProduct[];
    data?: BackendProduct[];
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  }
): PaginatedResponse<Product> {
  const items = raw.items ?? raw.data ?? [];
  return {
    data: mapProductList(items),
    total: raw.total ?? items.length,
    page: raw.page ?? 1,
    limit: raw.limit ?? items.length,
    totalPages: raw.totalPages ?? 1,
  };
}
