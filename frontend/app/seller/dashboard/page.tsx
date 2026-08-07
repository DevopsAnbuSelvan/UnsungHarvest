"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Package, DollarSign, ShoppingBag, Users } from "lucide-react";
import { SellerLayout } from "@/components/layout/seller-layout";
import { StatCard } from "@/components/common/stat-card";
import { DashboardCardSkeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { sellerService } from "@/services/seller.service";
import { formatCurrency } from "@/lib/utils";

export default function SellerDashboardPage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["seller-dashboard"],
    queryFn: sellerService.getDashboard,
  });

  return (
    <SellerLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold">Seller Dashboard</h2>
          <p className="text-muted-foreground">Manage your farm products and orders</p>
        </div>

        {isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <DashboardCardSkeleton key={i} />)}
          </div>
        )}
        {error && <ErrorState onRetry={() => refetch()} />}
        {data && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Total Products" value={data.totalProducts ?? 0} icon={Package} />
              <StatCard title="Total Sales" value={formatCurrency(data.totalSales ?? 0)} icon={DollarSign} />
              <StatCard title="Pending Orders" value={data.pendingOrders ?? 0} icon={ShoppingBag} />
              <StatCard title="Customers" value={data.totalCustomers ?? 0} icon={Users} />
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 gap-3">
                  <Link href="/seller/products/add"><Button className="w-full">Add Product</Button></Link>
                  <Link href="/seller/inventory"><Button variant="outline" className="w-full">Inventory</Button></Link>
                  <Link href="/seller/orders"><Button variant="outline" className="w-full">Orders</Button></Link>
                  <Link href="/seller/analytics"><Button variant="outline" className="w-full">Analytics</Button></Link>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </SellerLayout>
  );
}
