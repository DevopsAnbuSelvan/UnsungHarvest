"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { BuyerLayout } from "@/components/layout/buyer-layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { buyerService } from "@/services/buyer.service";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: order, isLoading, error, refetch } = useQuery({
    queryKey: ["buyer-order", id],
    queryFn: () => buyerService.getOrder(id),
  });

  return (
    <BuyerLayout>
      {isLoading && <Skeleton className="h-96 rounded-2xl" />}
      {error && <ErrorState onRetry={() => refetch()} />}
      {order && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Order #{order.orderNumber}</h2>
            <Badge className="capitalize">{order.status.toLowerCase()}</Badge>
          </div>
          <p className="text-muted-foreground">Placed on {formatDate(order.createdAt)}</p>

          <Card>
            <CardHeader><CardTitle>Items</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.productName} x {item.quantity}</span>
                  <span>{formatCurrency(item.total)}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Shipping Address</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-1">
              <p>{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.addressLine1}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
              <p>{order.shippingAddress.phone}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-2 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
              <div className="flex justify-between"><span>Delivery</span><span>{formatCurrency(order.deliveryCharges)}</span></div>
              {order.discount > 0 && <div className="flex justify-between text-emerald-600"><span>Discount</span><span>-{formatCurrency(order.discount)}</span></div>}
              <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total</span><span>{formatCurrency(order.total)}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Payment</span><span className="capitalize">{order.paymentMethod === "COD" ? "Cash on Delivery" : "Online"}</span></div>
            </CardContent>
          </Card>
        </div>
      )}
    </BuyerLayout>
  );
}
