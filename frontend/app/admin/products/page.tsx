"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { adminService } from "@/services/admin.service";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/ui/toast-context";

export default function ManageProductsPage() {
  const [status, setStatus] = useState("PENDING");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["admin-products", status],
    queryFn: () => adminService.getProducts(status),
  });

  const approve = useMutation({
    mutationFn: adminService.approveProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast({ title: "Product approved", type: "success" });
    },
  });

  const reject = useMutation({
    mutationFn: (id: string) => adminService.rejectProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast({ title: "Product rejected", type: "warning" });
    },
  });

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Manage Products</h2>
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-40">
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </Select>
      </div>
      <div className="space-y-4">
        {data?.data.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm text-muted-foreground">by {product.sellerName}</p>
                <p className="text-primary font-bold">{formatCurrency(product.price)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">{product.status.toLowerCase()}</Badge>
                {product.status === "PENDING" && (
                  <>
                    <Button size="sm" onClick={() => approve.mutate(product.id)}>
                      <Check className="h-4 w-4" /> Approve
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => reject.mutate(product.id)}>
                      <X className="h-4 w-4" /> Reject
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
}
