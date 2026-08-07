import { User } from "./auth";
import { Product } from "./product";
import { Order } from "./order";

export interface AdminDashboardStats {
  totalSales: number;
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  pendingSellers: number;
  pendingProducts: number;
  salesChart: { month: string; sales: number }[];
  recentOrders: Order[];
}

export interface SellerWithStatus extends User {
  farmName?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  productCount?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productCount?: number;
}

export interface SeasonCalendarEntry {
  id: string;
  month: number;
  productName: string;
  categoryId: string;
  region?: string;
}

export interface GiTagEntry {
  id: string;
  productName: string;
  tagNumber: string;
  region: string;
  description?: string;
}

export interface AdminReport {
  period: string;
  totalSales: number;
  totalOrders: number;
  topProducts: { name: string; sales: number }[];
  topSellers: { name: string; sales: number }[];
}

export interface PendingProduct extends Product {
  sellerName: string;
}
