"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { BuyerLayout } from "@/components/layout/buyer-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { orderService } from "@/services/order.service";
import { checkoutSchema, type CheckoutFormData } from "@/lib/validations";
import { useToast } from "@/components/ui/toast-context";

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { paymentMethod: "COD" },
  });

  const checkout = useMutation({
    mutationFn: orderService.checkout,
    onSuccess: (order) => {
      toast({ title: "Order placed successfully!", type: "success" });
      router.push(`/buyer/orders/${order.id}?success=true`);
    },
    onError: () => toast({ title: "Checkout failed", type: "error" }),
  });

  return (
    <BuyerLayout>
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>
      <form onSubmit={handleSubmit((data) => checkout.mutate(data))} className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader><CardTitle>Shipping Address</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {(["fullName", "phone", "addressLine1", "addressLine2", "city", "state", "pincode"] as const).map((field) => (
              <div key={field} className="space-y-2">
                <Label htmlFor={field} className="capitalize">{field.replace(/([A-Z])/g, " $1")}</Label>
                <Input id={field} {...register(`shippingAddress.${field}`)} />
                {errors.shippingAddress?.[field] && (
                  <p className="text-xs text-destructive">{errors.shippingAddress[field]?.message}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Payment Method</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <label className="flex items-center gap-3 p-4 rounded-xl border cursor-pointer hover:bg-accent">
              <input type="radio" value="COD" {...register("paymentMethod")} className="accent-primary" />
              <div>
                <p className="font-medium">Cash on Delivery</p>
                <p className="text-sm text-muted-foreground">Pay when you receive</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-4 rounded-xl border cursor-pointer hover:bg-accent opacity-60">
              <input type="radio" value="ONLINE" {...register("paymentMethod")} disabled className="accent-primary" />
              <div>
                <p className="font-medium">Online Payment</p>
                <p className="text-sm text-muted-foreground">Coming soon</p>
              </div>
            </label>
            <Button type="submit" className="w-full" size="lg" disabled={checkout.isPending}>
              {checkout.isPending ? "Placing Order..." : "Place Order"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </BuyerLayout>
  );
}
