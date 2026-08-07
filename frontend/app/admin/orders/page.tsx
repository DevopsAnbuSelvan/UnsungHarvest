"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { adminService } from "@/services/admin.service";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const { data } = useQuery({
    queryKey: ["admin-orders", page],
    queryFn: () => adminService.getOrders(page),
  });

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-6">All Orders</h2>
      <div className="space-y-4">
        {data?.data.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">#{order.orderNumber}</p>
                <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="capitalize">{order.status.toLowerCase()}</Badge>
                <span className="font-bold">{formatCurrency(order.total)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {data && <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} className="mt-8" />}
    </AdminLayout>
  );
}
