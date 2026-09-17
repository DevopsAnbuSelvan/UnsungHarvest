"use client";

import { useQuery } from "@tanstack/react-query";
import { SuperColdAdminLayout } from "@/components/layout/super-cold-admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminService } from "@/services/admin";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SuperColdAdminDashboardPage() {
  const { data } = useQuery({
    queryKey: ["super-cold-admin-dashboard"],
    queryFn: adminService.getDashboard,
  });

  return (
    <SuperColdAdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Super Cold Admin Dashboard</h2>
            <p className="text-sm text-muted-foreground">
              Full platform control including Admin management
            </p>
          </div>
          <Link href="/super-cold-admin/staff">
            <Button>Manage Admins</Button>
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {formatCurrency(data?.totalSales ?? 0)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{data?.totalUsers ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{data?.totalProducts ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{data?.totalOrders ?? 0}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </SuperColdAdminLayout>
  );
}
