"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { BuyerLayout } from "@/components/layout/buyer-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { cartService } from "@/services/cart.service";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/ui/toast-context";
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [couponCode, setCouponCode] = useState("");

  const { data: cart, isLoading, error, refetch } = useQuery({
    queryKey: ["cart"],
    queryFn: cartService.getCart,
  });

  const updateQty = useMutation({
    mutationFn: ({ id, qty }: { id: string; qty: number }) =>
      cartService.updateItem(id, qty),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const removeItem = useMutation({
    mutationFn: cartService.removeItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast({ title: "Item removed", type: "success" });
    },
  });

  const applyCoupon = useMutation({
    mutationFn: () => cartService.applyCoupon(couponCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast({ title: "Coupon applied!", type: "success" });
    },
    onError: () => toast({ title: "Invalid coupon", type: "error" }),
  });

  if (isLoading) return <BuyerLayout><Skeleton className="h-96 rounded-2xl" /></BuyerLayout>;
  if (error) return <BuyerLayout><ErrorState onRetry={() => refetch()} /></BuyerLayout>;

  return (
    <BuyerLayout>
      <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>

      {!cart?.items?.length ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">Your cart is empty</p>
          <Link href="/products"><Button>Browse Products</Button></Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4 flex gap-4">
                  <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-muted shrink-0">
                    <Image
                      src={item.product.images[0] || "/placeholder-product.svg"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.product.name}</h3>
                    <p className="text-primary font-bold">{formatCurrency(item.product.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQty.mutate({ id: item.id, qty: Math.max(1, item.quantity - 1) })}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQty.mutate({ id: item.id, qty: item.quantity + 1 })}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive ml-auto"
                        onClick={() => removeItem.mutate(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="h-fit">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-lg">Order Summary</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <Button
                  variant="outline"
                  onClick={() => applyCoupon.mutate()}
                  disabled={!couponCode}
                >
                  Apply
                </Button>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>{formatCurrency(cart.deliveryCharges)}</span>
                </div>
                {cart.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span>-{formatCurrency(cart.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>{formatCurrency(cart.total)}</span>
                </div>
              </div>
              <Link href="/buyer/checkout">
                <Button className="w-full" size="lg">Proceed to Checkout</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      )}
    </BuyerLayout>
  );
}
