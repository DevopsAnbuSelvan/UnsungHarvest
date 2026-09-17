"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { adminService } from "@/services/admin";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useToast } from "@/components/ui/toast-context";

export default function AdminPaymentsPage() {
  const [page, setPage] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["admin-payments", page],
    queryFn: () => adminService.getPayments(page),
  });

  const confirm = useMutation({
    mutationFn: (id: string) => adminService.confirmPayment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-payments"] });
      toast({ title: "Payment confirmed", type: "success" });
    },
    onError: () => toast({ title: "Failed to confirm payment", type: "error" }),
  });

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-6">Payments</h2>
      <div className="space-y-4">
        {data?.data.map((payment) => {
          const status = String(payment.status || "pending").toLowerCase();
          const amount = Number(payment.amount) || 0;
          const order = payment.order as { orderNumber?: string } | undefined;
          const user = payment.user as
            | { name?: string; email?: string }
            | undefined;
          return (
            <Card key={String(payment.id)}>
              <CardContent className="p-4 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                <div>
                  <p className="font-semibold">
                    {order?.orderNumber ||
                      `Payment ${String(payment.id).slice(0, 8)}`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {user?.name || user?.email || "Buyer"}
                    {payment.createdAt
                      ? ` · ${formatDate(String(payment.createdAt))}`
                      : ""}
                  </p>
                  <p className="text-sm capitalize">
                    Method: {String(payment.method || "—")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="capitalize">
                    {status}
                  </Badge>
                  <span className="font-bold">{formatCurrency(amount)}</span>
                  {status === "pending" && (
                    <Button
                      size="sm"
                      onClick={() => confirm.mutate(String(payment.id))}
                    >
                      <Check className="h-4 w-4" />
                      Confirm
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
        {data?.data.length === 0 && (
          <p className="text-sm text-muted-foreground">No payments yet.</p>
        )}
      </div>
      {data && data.totalPages > 1 && (
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
