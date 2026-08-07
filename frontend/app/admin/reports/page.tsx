"use client";

import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/common/stat-card";
import { adminService } from "@/services/admin.service";
import { formatCurrency } from "@/lib/utils";
import { DollarSign, ShoppingBag } from "lucide-react";

export default function ReportsPage() {
  const { data } = useQuery({
    queryKey: ["admin-reports"],
    queryFn: () => adminService.getReports(),
  });

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-6">Reports</h2>
      {data && (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <StatCard title="Total Sales" value={formatCurrency(data.totalSales)} icon={DollarSign} />
            <StatCard title="Total Orders" value={data.totalOrders} icon={ShoppingBag} />
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Top Products</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {data.topProducts?.map((p) => (
                  <div key={p.name} className="flex justify-between text-sm">
                    <span>{p.name}</span>
                    <span>{formatCurrency(p.sales)}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Top Sellers</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {data.topSellers?.map((s) => (
                  <div key={s.name} className="flex justify-between text-sm">
                    <span>{s.name}</span>
                    <span>{formatCurrency(s.sales)}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
