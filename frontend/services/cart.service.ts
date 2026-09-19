import api from "@/lib/axios";
import { EndPoints } from "@/constants/end_points";
import { mapProduct } from "@/utils/product";
import type { Cart, CartItem } from "@/types/cart";

type BackendCartRow = {
  id: string;
  productId: string;
  quantity: number;
  product?: Parameters<typeof mapProduct>[0];
};

function mapCartRows(rows: BackendCartRow[]): Cart {
  const items: CartItem[] = (rows || []).map((row) => {
    const product = mapProduct(
      row.product ?? {
        id: row.productId,
        name: "Product",
        description: "",
        price: 0,
        stock: 0,
        images: [],
      }
    );

    return {
      id: row.id,
      productId: row.productId,
      quantity: row.quantity,
      product,
    };
  });

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );
  const deliveryCharges = 0;
  const discount = 0;

  return {
    id: "cart",
    items,
    subtotal,
    deliveryCharges,
    discount,
    total: subtotal + deliveryCharges - discount,
  };
}

function asCartRows(data: unknown): BackendCartRow[] {
  if (Array.isArray(data)) return data as BackendCartRow[];
  if (data && typeof data === "object" && "items" in data) {
    const items = (data as { items?: BackendCartRow[] }).items;
    return Array.isArray(items) ? items : [];
  }
  return [];
}

export const cartService = {
  getCart: async (): Promise<Cart> => {
    const { data } = await api.post(EndPoints.cartGet);
    return mapCartRows(asCartRows(data));
  },

  addItem: async (productId: string, quantity = 1): Promise<Cart> => {
    await api.post(EndPoints.cartAdd, { productId, quantity });
    return cartService.getCart();
  },

  updateItem: async (itemId: string, quantity: number): Promise<Cart> => {
    await api.post(EndPoints.cartUpdate, { id: itemId, quantity });
    return cartService.getCart();
  },

  removeItem: async (itemId: string): Promise<Cart> => {
    await api.post(EndPoints.cartRemove, { id: itemId });
    return cartService.getCart();
  },

  applyCoupon: async (_code: string): Promise<Cart> => {
    return cartService.getCart();
  },

  clearCart: async (): Promise<void> => {
    await api.post(EndPoints.cartClear);
  },
};
