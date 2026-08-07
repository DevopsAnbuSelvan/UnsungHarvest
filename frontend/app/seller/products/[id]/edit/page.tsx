"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { SellerLayout } from "@/components/layout/seller-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { sellerService } from "@/services/seller.service";
import { formatCurrency } from "@/lib/utils";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: product, isLoading } = useQuery({
    queryKey: ["seller-product", id],
    queryFn: () => sellerService.getProduct(id),
  });

  return (
    <SellerLayout>
      <h2 className="text-2xl font-bold mb-6">Edit Product</h2>
      {isLoading && <Skeleton className="h-64 rounded-2xl" />}
      {product && (
        <Card className="max-w-2xl">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-xl font-semibold">{product.name}</h3>
            <p className="text-muted-foreground">{product.description}</p>
            <div className="flex gap-4">
              <span className="font-bold text-primary">{formatCurrency(product.price)}</span>
              <span>Stock: {product.stock}</span>
              <Badge variant="outline" className="capitalize">{product.status.toLowerCase()}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Use the same form as Add Product with pre-filled values. Full edit form connects to sellerService.updateProduct.
            </p>
          </CardContent>
        </Card>
      )}
    </SellerLayout>
  );
}
