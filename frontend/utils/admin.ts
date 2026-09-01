import { mapProduct } from "@/utils/product";
import type { SellerWithStatus, PendingProduct } from "@/types/admin";
import type { PaginatedResponse } from "@/types/product";

type BackendSellerProfile = {
  id: string;
  businessName?: string;
  status?: string;
  createdAt?: string;
  user?: {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    createdAt?: string;
  };
};

type BackendProduct = Parameters<typeof mapProduct>[0];

export function toBackendApprovalStatus(status?: string): string | undefined {
  return status ? status.toLowerCase() : undefined;
}

export function mapSellerProfile(raw: BackendSellerProfile): SellerWithStatus {
  const name = raw.user?.name?.trim() || raw.businessName || "";
  const parts = name.split(/\s+/);

  return {
    id: raw.id,
    email: raw.user?.email ?? "",
    firstName: parts[0] ?? "",
    lastName: parts.slice(1).join(" ") ?? "",
    role: "SELLER",
    phone: raw.user?.phone,
    isActive: true,
    createdAt: raw.user?.createdAt ?? raw.createdAt ?? new Date().toISOString(),
    farmName: raw.businessName,
    status: (raw.status?.toUpperCase() ?? "PENDING") as SellerWithStatus["status"],
  };
}

export function mapSellerList(
  raw: {
    items?: BackendSellerProfile[];
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  }
): PaginatedResponse<SellerWithStatus> {
  const items = raw.items ?? [];
  return {
    data: items.map(mapSellerProfile),
    total: raw.total ?? items.length,
    page: raw.page ?? 1,
    limit: raw.limit ?? items.length,
    totalPages: raw.totalPages ?? 1,
  };
}

export function mapPendingProduct(raw: BackendProduct): PendingProduct {
  const product = mapProduct(raw);
  const sellerName =
    raw.seller?.user?.name?.trim() ||
    raw.seller?.businessName ||
    "Unknown seller";

  return { ...product, sellerName };
}

export function mapPendingProductList(
  raw: {
    items?: BackendProduct[];
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  }
): PaginatedResponse<PendingProduct> {
  const items = raw.items ?? [];
  return {
    data: items.map(mapPendingProduct),
    total: raw.total ?? items.length,
    page: raw.page ?? 1,
    limit: raw.limit ?? items.length,
    totalPages: raw.totalPages ?? 1,
  };
}
