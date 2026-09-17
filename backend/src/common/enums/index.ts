export enum UserRole {
  BUYER = 'buyer',
  SELLER = 'seller',
  ADMIN = 'admin',
  SUPER_COLD_ADMIN = 'super_cold_admin',
}

/** Platform staff who can access the admin panel */
export const STAFF_ROLES: UserRole[] = [
  UserRole.ADMIN,
  UserRole.SUPER_COLD_ADMIN,
];

export function isStaffRole(role?: string | null): boolean {
  return role === UserRole.ADMIN || role === UserRole.SUPER_COLD_ADMIN;
}

export function isSuperColdAdmin(role?: string | null): boolean {
  return role === UserRole.SUPER_COLD_ADMIN;
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification',
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PACKED = 'packed',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum ProductStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ARCHIVED = 'archived',
}

export enum GiStatus {
  REGISTERED = 'registered',
  PENDING = 'pending',
  NOT_APPLICABLE = 'not_applicable',
}

export enum NotificationType {
  ORDER = 'order',
  PRODUCT = 'product',
  SELLER = 'seller',
  SYSTEM = 'system',
  PAYMENT = 'payment',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  CARD = 'card',
  UPI = 'upi',
  COD = 'cod',
  WALLET = 'wallet',
}

export enum AddressType {
  HOME = 'home',
  WORK = 'work',
  OTHER = 'other',
}
