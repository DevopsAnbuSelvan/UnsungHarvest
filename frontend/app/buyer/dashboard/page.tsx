"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Package, ShoppingCart } from "lucide-react";
import { BuyerLayout } from "@/components/layout/buyer-layout";
import { StatCard } from "@/components/common/stat-card";
import { DashboardCardSkeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { buyerService } from "@/services/buyer.service";
import { formatCurrency } from "@/lib/utils";

export default function BuyerDashboardPage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["buyer-dashboard"],
    queryFn: buyerService.getDashboard,
  });

  return (
    <BuyerLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold">Welcome back!</h2>
          <p className="text-muted-foreground">
            Here&apos;s your shopping overview
          </p>
        </div>

        {isLoading && (
          <div className="grid sm:grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <DashboardCardSkeleton key={i} />
            ))}
          </div>
        )}

        {error && <ErrorState onRetry={() => refetch()} />}

        {data && (
          <>
            <div className="grid sm:grid-cols-2 gap-4">
              <StatCard
                title="Total Orders"
                value={data.totalOrders ?? 0}
                icon={Package}
              />
              <StatCard
                title="Cart Items"
                value={data.cartCount ?? 0}
                icon={ShoppingCart}
              />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.recentOrders?.length ? (
                    <div className="space-y-3">
                      {data.recentOrders.map(
                        (order: {
                          id: string;
                          orderNumber: string;
                          total: number;
                          status: string;
                        }) => (
                          <div
                            key={order.id}
                            className="flex justify-between items-center text-sm"
                          >
                            <span>#{order.orderNumber}</span>
                            <span>{formatCurrency(order.total)}</span>
                            <span className="text-muted-foreground capitalize">
                              {order.status.toLowerCase()}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      No orders yet
                    </p>
                  )}
                  <Link href="/buyer/orders">
                    <Button variant="outline" className="mt-4 w-full">
                      View All Orders
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3">
                  <Link href="/products">
                    <Button variant="outline" className="w-full">
                      Browse Products
                    </Button>
                  </Link>
                  <Link href="/buyer/cart">
                    <Button variant="outline" className="w-full">
                      View Cart
                    </Button>
                  </Link>
                  <Link href="/buyer/orders">
                    <Button variant="outline" className="w-full">
                      My Orders
                    </Button>
                  </Link>
                  <Link href="/buyer/profile">
                    <Button variant="outline" className="w-full">
                      Edit Profile
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </BuyerLayout>
  );
}
