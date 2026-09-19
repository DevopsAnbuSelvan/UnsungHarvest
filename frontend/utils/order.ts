import type { Address, Order, OrderItem, PaymentMethod } from "@/types/order";

type BackendOrderItem = {
  id: string;
  productId?: string;
  productName?: string;
  quantity?: number;
  unitPrice?: number | string;
  totalPrice?: number | string;
  price?: number | string;
  total?: number | string;
  product?: { images?: { imageUrl?: string }[]; name?: string };
};

type BackendAddress = {
  id?: string;
  fullName?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  pincode?: string;
  isDefault?: boolean;
};

type BackendOrder = {
  id: string;
  orderNumber?: string;
  buyerId?: string;
  items?: BackendOrderItem[];
  subtotal?: number | string;
  shippingFee?: number | string;
  deliveryCharges?: number | string;
  tax?: number | string;
  discount?: number | string;
  total?: number | string;
  status?: string;
  notes?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  shippingAddress?: BackendAddress | null;
  createdAt?: string;
  updatedAt?: string;
};

function num(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function mapAddress(addr?: BackendAddress | null): Address {
  return {
    id: addr?.id,
    fullName: addr?.fullName || "—",
    phone: addr?.phone || "—",
    addressLine1: addr?.addressLine1 || "—",
    addressLine2: addr?.addressLine2,
    city: addr?.city || "—",
    state: addr?.state || "—",
    pincode: addr?.postalCode || addr?.pincode || "—",
    isDefault: addr?.isDefault,
  };
}

function mapItem(item: BackendOrderItem): OrderItem {
  const unit = num(item.unitPrice ?? item.price);
  const total = num(item.totalPrice ?? item.total, unit * num(item.quantity, 1));
  const image = item.product?.images?.[0]?.imageUrl;

  return {
    id: item.id,
    productId: item.productId || "",
    productName: item.productName || item.product?.name || "Product",
    productImage: image,
    quantity: num(item.quantity, 1),
    price: unit,
    total,
  };
}

function parsePaymentMethod(raw?: BackendOrder): PaymentMethod {
  if (raw?.paymentMethod === "COD" || raw?.paymentMethod === "cod") return "COD";
  if (raw?.paymentMethod === "ONLINE") return "ONLINE";
  if (raw?.notes?.toUpperCase().includes("COD")) return "COD";
  return "COD";
}

export function mapOrder(raw: BackendOrder): Order {
  return {
    id: raw.id,
    orderNumber: raw.orderNumber || raw.id.slice(0, 8),
    buyerId: raw.buyerId || "",
    items: (raw.items || []).map(mapItem),
    subtotal: num(raw.subtotal),
    deliveryCharges: num(raw.deliveryCharges ?? raw.shippingFee),
    discount: num(raw.discount),
    total: num(raw.total),
    status: (raw.status?.toUpperCase() || "PENDING") as Order["status"],
    paymentMethod: parsePaymentMethod(raw),
    paymentStatus: (raw.paymentStatus?.toUpperCase() || "PENDING") as Order["paymentStatus"],
    shippingAddress: mapAddress(raw.shippingAddress),
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || raw.createdAt || new Date().toISOString(),
  };
}
