"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { BuyerLayout } from "@/components/layout/buyer-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { buyerService } from "@/services/buyer.service";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useState } from "react";

export default function BuyerOrdersPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["buyer-orders", page],
    queryFn: () => buyerService.getOrders(page),
  });

  return (
    <BuyerLayout>
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>
      {isLoading && <Skeleton className="h-64 rounded-2xl" />}
      {error && <ErrorState onRetry={() => refetch()} />}
      {data && (
        <>
          <div className="space-y-4">
            {data.data.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold">#{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                    <p className="text-sm">{order.items.length} item(s)</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="capitalize">{order.status.toLowerCase()}</Badge>
                    <span className="font-bold">{formatCurrency(order.total)}</span>
                    <Link href={`/buyer/orders/${order.id}`}>
                      <Button variant="outline" size="sm">View</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
            {!data.data.length && (
              <p className="text-center text-muted-foreground py-12">No orders yet</p>
            )}
          </div>
          <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} className="mt-8" />
        </>
      )}
    </BuyerLayout>
  );
}
