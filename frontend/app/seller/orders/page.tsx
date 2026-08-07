"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SellerLayout } from "@/components/layout/seller-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { sellerService } from "@/services/seller.service";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function SellerOrdersPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ["seller-orders", page],
    queryFn: () => sellerService.getOrders(page),
  });

  return (
    <SellerLayout>
      <h2 className="text-2xl font-bold mb-6">Orders</h2>
      {isLoading && <Skeleton className="h-64 rounded-2xl" />}
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
    </SellerLayout>
  );
}
