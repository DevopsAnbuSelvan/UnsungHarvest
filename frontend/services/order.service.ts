import api from "@/lib/axios";
import { EndPoints } from "@/constants/end_points";
import { cartService } from "@/services/cart.service";
import { mapOrder } from "@/utils/order";
import type { CheckoutPayload, Order } from "@/types/order";
import type { PaginatedResponse } from "@/types/product";

type CreatedAddress = { id: string };

export const orderService = {
  getAll: async (page = 1): Promise<PaginatedResponse<Order>> => {
    const { data } = await api.post(EndPoints.ordersMyOrders, {
      page,
      limit: 10,
    });
    const body = data as {
      items?: unknown[];
      data?: unknown[];
      total?: number;
      page?: number;
      limit?: number;
      totalPages?: number;
    };
    const rawItems = body.items ?? body.data ?? [];
    const items = rawItems.map((row) =>
      mapOrder(row as Parameters<typeof mapOrder>[0])
    );
    return {
      data: items,
      total: body.total ?? items.length,
      page: body.page ?? page,
      limit: body.limit ?? 10,
      totalPages: body.totalPages ?? 1,
    };
  },

  getById: async (id: string): Promise<Order> => {
    const { data } = await api.post(EndPoints.ordersGet, { id });
    return mapOrder(data as Parameters<typeof mapOrder>[0]);
  },

  checkout: async (payload: CheckoutPayload): Promise<Order> => {
    const cart = await cartService.getCart();
    if (!cart.items.length) {
      throw new Error("Your cart is empty");
    }

    const addr = payload.shippingAddress;
    const { data: address } = await api.post<CreatedAddress>(
      EndPoints.buyersAddressesCreate,
      {
        label: "Shipping",
        fullName: addr.fullName,
        phone: addr.phone,
        addressLine1: addr.addressLine1,
        addressLine2: addr.addressLine2 || undefined,
        city: addr.city,
        state: addr.state,
        postalCode: addr.pincode,
        country: "India",
      }
    );

    const { data: order } = await api.post(EndPoints.ordersCreate, {
      items: cart.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      shippingAddressId: address.id,
      notes: `Payment method: ${payload.paymentMethod}${
        payload.couponCode ? `; Coupon: ${payload.couponCode}` : ""
      }`,
    });

    await cartService.clearCart().catch(() => undefined);
    return mapOrder(order as Parameters<typeof mapOrder>[0]);
  },

  cancel: async (id: string): Promise<Order> => {
    const { data } = await api.post(EndPoints.ordersUpdateStatus, {
      id,
      status: "cancelled",
    });
    return mapOrder(data as Parameters<typeof mapOrder>[0]);
  },
};
