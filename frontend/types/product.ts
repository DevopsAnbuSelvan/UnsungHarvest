export type ProductStatus = "PENDING" | "APPROVED" | "REJECTED" | "DRAFT";

export interface NutritionInfo {
  id: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  vitamins?: string;
  minerals?: string;
}

export interface Location {
  id: string;
  name: string;
  state: string;
  district?: string;
  latitude?: number;
  longitude?: number;
}

export interface SellerSummary {
  id: string;
  firstName: string;
  lastName: string;
  farmName?: string;
  location?: Location;
  rating?: number;
}

export interface Product {
  id: string;
  name: string;
  localName?: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  categoryId: string;
  category?: { id: string; name: string };
  sellerId: string;
  seller?: SellerSummary;
  location?: Location;
  season: string[];
  isGiTagged: boolean;
  giTagNumber?: string;
  nutrition?: NutritionInfo;
  status: ProductStatus;
  availabilityMonths: number[];
  cultivationPlace?: string;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  season?: string;
  isGiTagged?: boolean;
  minPrice?: number;
  maxPrice?: number;
  locationId?: string;
  sortBy?: "price" | "name" | "createdAt" | "rating";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}
