"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { SellerLayout } from "@/components/layout/seller-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { sellerService } from "@/services/seller.service";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/ui/toast-context";

export default function SellerProductsPage() {
  const [page, setPage] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["seller-products", page],
    queryFn: () => sellerService.getProducts(page),
  });

  const deleteProduct = useMutation({
    mutationFn: sellerService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-products"] });
      toast({ title: "Product deleted", type: "success" });
    },
  });

  return (
    <SellerLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">My Products</h2>
        <Link href="/seller/products/add">
          <Button><Plus className="h-4 w-4" /> Add Product</Button>
        </Link>
      </div>
      {isLoading && <Skeleton className="h-64 rounded-2xl" />}
      {!isLoading && data?.data.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            No products yet. Add your first product to get started.
          </CardContent>
        </Card>
      )}
      <div className="space-y-4">
        {data?.data.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-muted-foreground">Stock: {product.stock}</p>
                <p className="text-primary font-bold">{formatCurrency(product.price)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">{product.status.toLowerCase()}</Badge>
                <Link href={`/seller/products/${product.id}/edit`}>
                  <Button variant="outline" size="icon"><Pencil className="h-4 w-4" /></Button>
                </Link>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-destructive"
                  onClick={() => deleteProduct.mutate(product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {data && <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} className="mt-8" />}
    </SellerLayout>
  );
}
