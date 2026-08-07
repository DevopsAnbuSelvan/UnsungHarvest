"use client";

import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { SellerLayout } from "@/components/layout/seller-layout";
import { StatCard } from "@/components/common/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { sellerService } from "@/services/seller.service";
import { formatCurrency } from "@/lib/utils";
import { DollarSign, ShoppingBag, TrendingUp } from "lucide-react";

export default function AnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["seller-analytics"],
    queryFn: sellerService.getAnalytics,
  });

  return (
    <SellerLayout>
      <h2 className="text-2xl font-bold mb-6">Sales Analytics</h2>
      {isLoading && <Skeleton className="h-64 rounded-2xl" />}
      {data && (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-3 gap-4">
            <StatCard title="Total Revenue" value={formatCurrency(data.totalRevenue ?? 0)} icon={DollarSign} />
            <StatCard title="Total Orders" value={data.totalOrders ?? 0} icon={ShoppingBag} />
            <StatCard title="Growth" value={`${data.growth ?? 0}%`} icon={TrendingUp} />
          </div>
          <Card>
            <CardHeader><CardTitle>Monthly Sales</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.monthlySales || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </SellerLayout>
  );
}
