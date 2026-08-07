"use client";

import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { adminService } from "@/services/admin.service";

export default function CategoriesPage() {
  const { data } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: adminService.getCategories,
  });

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-6">Categories</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.map((cat) => (
          <Card key={cat.id}>
            <CardContent className="p-4">
              <p className="font-semibold">{cat.name}</p>
              <p className="text-sm text-muted-foreground">{cat.slug}</p>
              {cat.productCount !== undefined && (
                <p className="text-sm mt-1">{cat.productCount} products</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
}
