"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { adminService } from "@/services/admin.service";
import { useToast } from "@/components/ui/toast-context";

export default function ManageSellersPage() {
  const [status, setStatus] = useState("PENDING");
  const [page, setPage] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["admin-sellers", status, page],
    queryFn: () => adminService.getSellers(status),
  });

  const approve = useMutation({
    mutationFn: adminService.approveSeller,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-sellers"] });
      toast({ title: "Seller approved", type: "success" });
    },
  });

  const reject = useMutation({
    mutationFn: (id: string) => adminService.rejectSeller(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-sellers"] });
      toast({ title: "Seller rejected", type: "warning" });
    },
  });

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Manage Sellers</h2>
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-40">
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </Select>
      </div>
      <div className="space-y-4">
        {data?.data.map((seller) => (
          <Card key={seller.id}>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">{seller.firstName} {seller.lastName}</p>
                <p className="text-sm text-muted-foreground">{seller.email}</p>
                {seller.farmName && <p className="text-sm">{seller.farmName}</p>}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">{seller.status.toLowerCase()}</Badge>
                {seller.status === "PENDING" && (
                  <>
                    <Button size="sm" onClick={() => approve.mutate(seller.id)}>
                      <Check className="h-4 w-4" /> Approve
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => reject.mutate(seller.id)}>
                      <X className="h-4 w-4" /> Reject
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {data && <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} className="mt-8" />}
    </AdminLayout>
  );
}
