"use client";

import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { adminService } from "@/services/admin";
import { formatCurrency } from "@/lib/utils";

export default function GiTagsPage() {
  const { data } = useQuery({
    queryKey: ["admin-gi-tags"],
    queryFn: async () => {
      const products = await adminService.getProducts("APPROVED", 1, 100);
      return products.data.filter((p) => p.isGiTagged);
    },
  });

  return (
    <AdminLayout>
      <div className="space-y-2 mb-6">
        <h2 className="text-2xl font-bold">GI Tag Database</h2>
        <p className="text-sm text-muted-foreground">
          GI-tagged products. Edit GI status from Manage Products.
        </p>
      </div>
      <div className="space-y-4">
        {data?.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm text-muted-foreground">
                  {product.sellerName}
                  {product.location?.name ? ` · ${product.location.name}` : ""}
                </p>
                <p className="text-primary font-bold">
                  {formatCurrency(product.price)}
                </p>
              </div>
              <Badge variant="gi">
                {product.giTagNumber || "GI Registered"}
              </Badge>
            </CardContent>
          </Card>
        ))}
        {data?.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No GI-tagged products found.
          </p>
        )}
      </div>
    </AdminLayout>
  );
}
