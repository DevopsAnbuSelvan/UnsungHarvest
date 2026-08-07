"use client";

import { useQuery } from "@tanstack/react-query";
import { DollarSign, Users, Package, ShoppingBag, Store, Clock } from "lucide-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { StatCard } from "@/components/common/stat-card";
import { DashboardCardSkeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { adminService } from "@/services/admin.service";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

export default function AdminDashboardPage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: adminService.getDashboard,
  });

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <p className="text-muted-foreground">Platform overview and pending approvals</p>
        </div>

        {isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <DashboardCardSkeleton key={i} />)}
          </div>
        )}
        {error && <ErrorState onRetry={() => refetch()} />}
        {data && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard title="Total Sales" value={formatCurrency(data.totalSales)} icon={DollarSign} />
              <StatCard title="Total Users" value={data.totalUsers} icon={Users} />
              <StatCard title="Total Products" value={data.totalProducts} icon={Package} />
              <StatCard title="Total Orders" value={data.totalOrders} icon={ShoppingBag} />
              <StatCard title="Pending Sellers" value={data.pendingSellers} icon={Store} />
              <StatCard title="Pending Products" value={data.pendingProducts} icon={Clock} />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle>Sales Overview</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={data.salesChart || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="sales" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Latest Orders</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {data.recentOrders?.map((order) => (
                    <div key={order.id} className="flex justify-between items-center text-sm">
                      <span>#{order.orderNumber}</span>
                      <span>{formatCurrency(order.total)}</span>
                      <Badge variant="outline" className="capitalize">{order.status.toLowerCase()}</Badge>
                      <span className="text-muted-foreground">{formatDate(order.createdAt)}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
