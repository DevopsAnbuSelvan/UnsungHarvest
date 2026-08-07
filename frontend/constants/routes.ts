import { UserRole } from "@/types/auth";

export const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/products",
  "/products/seasonal",
  "/products/gi-tagged",
  "/nutrition",
  "/contact",
  "/login",
  "/register",
] as const;

export const BUYER_ROUTES = [
  "/buyer/dashboard",
  "/buyer/profile",
  "/buyer/wishlist",
  "/buyer/cart",
  "/buyer/checkout",
  "/buyer/orders",
  "/buyer/notifications",
  "/buyer/settings",
] as const;

export const SELLER_ROUTES = [
  "/seller/dashboard",
  "/seller/products",
  "/seller/products/add",
  "/seller/inventory",
  "/seller/orders",
  "/seller/analytics",
  "/seller/customers",
  "/seller/profile",
  "/seller/settings",
] as const;

export const ADMIN_ROUTES = [
  "/admin/dashboard",
  "/admin/sellers",
  "/admin/buyers",
  "/admin/products",
  "/admin/categories",
  "/admin/season-calendar",
  "/admin/nutrition",
  "/admin/gi-tags",
  "/admin/locations",
  "/admin/orders",
  "/admin/reports",
  "/admin/settings",
] as const;

export const ROLE_DASHBOARD: Record<UserRole, string> = {
  BUYER: "/buyer/dashboard",
  SELLER: "/seller/dashboard",
  SUPER_COLD_ADMIN: "/admin/dashboard",
};

export const ROLE_ROUTE_PREFIX: Record<UserRole, string> = {
  BUYER: "/buyer",
  SELLER: "/seller",
  SUPER_COLD_ADMIN: "/admin",
};
