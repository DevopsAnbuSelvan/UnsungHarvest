"use client";

import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { adminService } from "@/services/admin.service";
import { useState } from "react";

export default function ManageBuyersPage() {
  const [page, setPage] = useState(1);
  const { data } = useQuery({
    queryKey: ["admin-buyers", page],
    queryFn: () => adminService.getBuyers(),
  });

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-6">Manage Buyers</h2>
      <div className="space-y-3">
        {data?.data.map((buyer) => (
          <Card key={buyer.id}>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">{buyer.firstName} {buyer.lastName}</p>
                <p className="text-sm text-muted-foreground">{buyer.email}</p>
              </div>
              <Badge variant={buyer.isActive ? "default" : "destructive"}>
                {buyer.isActive ? "Active" : "Inactive"}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
      {data && <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} className="mt-8" />}
    </AdminLayout>
  );
}
