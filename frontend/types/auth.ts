export type UserRole = "BUYER" | "SELLER" | "ADMIN" | "SUPER_COLD_ADMIN";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "BUYER" | "SELLER";
  phone?: string;
}

export function isAdminPanelRole(role?: string | null): boolean {
  return role === "ADMIN" || role === "SUPER_COLD_ADMIN";
}

export function isSuperColdAdmin(role?: string | null): boolean {
  return role === "SUPER_COLD_ADMIN";
}
