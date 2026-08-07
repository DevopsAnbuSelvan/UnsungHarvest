"use client";

import { useQuery } from "@tanstack/react-query";
import { SellerLayout } from "@/components/layout/seller-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { sellerService } from "@/services/seller.service";

export default function CustomersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["seller-customers"],
    queryFn: sellerService.getCustomers,
  });

  return (
    <SellerLayout>
      <h2 className="text-2xl font-bold mb-6">Customers</h2>
      {isLoading && <Skeleton className="h-64 rounded-2xl" />}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(Array.isArray(data) ? data : data?.customers || [])?.map((c: { id: string; firstName: string; lastName: string; email: string; orderCount?: number }) => (
          <Card key={c.id}>
            <CardContent className="p-4">
              <p className="font-semibold">{c.firstName} {c.lastName}</p>
              <p className="text-sm text-muted-foreground">{c.email}</p>
              {c.orderCount !== undefined && (
                <p className="text-sm mt-2">{c.orderCount} orders</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </SellerLayout>
  );
}
