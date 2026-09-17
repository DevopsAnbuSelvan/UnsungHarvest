"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { adminService } from "@/services/admin";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useToast } from "@/components/ui/toast-context";

const STATUSES = [
  "pending",
  "confirmed",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
];

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["admin-orders", page],
    queryFn: () => adminService.getOrders(page),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminService.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast({ title: "Order status updated", type: "success" });
    },
    onError: () => toast({ title: "Failed to update status", type: "error" }),
  });

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-6">All Orders</h2>
      <div className="space-y-4">
        {data?.data.map((order) => {
          const status = String(order.status || "pending").toLowerCase();
          return (
            <Card key={order.id}>
              <CardContent className="p-4 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                <div>
                  <p className="font-semibold">
                    #{order.orderNumber || order.id.slice(0, 8)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="outline" className="capitalize">
                    {status}
                  </Badge>
                  <span className="font-bold">
                    {formatCurrency(Number(order.total) || 0)}
                  </span>
                  <Select
                    value={status}
                    className="w-36"
                    onChange={(e) =>
                      updateStatus.mutate({
                        id: order.id,
                        status: e.target.value,
                      })
                    }
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </Select>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {data && (
        <Pagination
          page={data.page}
          totalPages={data.totalPages}
          onPageChange={setPage}
          className="mt-8"
        />
      )}
    </AdminLayout>
  );
}
