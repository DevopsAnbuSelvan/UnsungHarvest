"use client";

import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { adminService } from "@/services/admin.service";

export default function AdminNutritionPage() {
  const { data } = useQuery({
    queryKey: ["admin-nutrition"],
    queryFn: adminService.getNutrition,
  });

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-6">Nutrition Database</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4 grid grid-cols-2 gap-1 text-sm">
              {item.calories && <span>Calories: {item.calories}</span>}
              {item.protein && <span>Protein: {item.protein}g</span>}
              {item.carbs && <span>Carbs: {item.carbs}g</span>}
              {item.fiber && <span>Fiber: {item.fiber}g</span>}
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
}
