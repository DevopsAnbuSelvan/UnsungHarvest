import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  User,
  UserRole,
} from "@/types/auth";

type BackendUser = {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  role?: string;
  status?: string;
  createdAt?: string;
};

const ROLE_MAP: Record<string, UserRole> = {
  buyer: "BUYER",
  seller: "SELLER",
  super_cold_admin: "SUPER_COLD_ADMIN",
};

export function mapUser(raw: BackendUser): User {
  const name = raw.name?.trim() || "";
  const parts = name.split(/\s+/);

  return {
    id: raw.id,
    email: raw.email,
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" ") || "",
    role: ROLE_MAP[raw.role ?? ""] ?? "BUYER",
    phone: raw.phone,
    isActive: raw.status === "active",
    createdAt: raw.createdAt || new Date().toISOString(),
  };
}

export function mapAuthResponse(raw: {
  accessToken: string;
  refreshToken?: string;
  user: BackendUser;
}): AuthResponse {
  return {
    accessToken: raw.accessToken,
    user: mapUser(raw.user),
  };
}

export function toRegisterBody(payload: RegisterPayload) {
  return {
    name: `${payload.firstName} ${payload.lastName}`.trim(),
    email: payload.email,
    password: payload.password,
    phone: payload.phone,
    role: payload.role.toLowerCase(),
    ...(payload.role === "SELLER"
      ? { businessName: `${payload.firstName} ${payload.lastName}`.trim() }
      : {}),
  };
}

export function toLoginBody(payload: LoginPayload) {
  return {
    email: payload.email,
    password: payload.password,
  };
}
