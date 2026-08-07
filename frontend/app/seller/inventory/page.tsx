"use client";

import { useQuery } from "@tanstack/react-query";
import { SellerLayout } from "@/components/layout/seller-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { sellerService } from "@/services/seller.service";

export default function InventoryPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["seller-inventory"],
    queryFn: sellerService.getInventory,
  });

  return (
    <SellerLayout>
      <h2 className="text-2xl font-bold mb-6">Inventory</h2>
      {isLoading && <Skeleton className="h-64 rounded-2xl" />}
      <div className="space-y-3">
        {(Array.isArray(data) ? data : data?.items || [])?.map((item: { id: string; name: string; stock: number; status?: string }) => (
          <Card key={item.id}>
            <CardContent className="p-4 flex justify-between items-center">
              <span className="font-medium">{item.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-sm">Stock: {item.stock}</span>
                {item.stock < 10 && <Badge variant="destructive">Low Stock</Badge>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </SellerLayout>
  );
}
