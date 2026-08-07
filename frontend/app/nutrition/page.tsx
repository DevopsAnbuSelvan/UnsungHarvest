"use client";

import { useQuery } from "@tanstack/react-query";
import { PublicLayout } from "@/components/layout/public-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { nutritionService } from "@/services/nutrition.service";
import { Apple } from "lucide-react";

export default function NutritionPage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["nutrition"],
    queryFn: nutritionService.getAll,
  });

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Apple className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Nutrition Information</h1>
            <p className="text-muted-foreground">
              Explore nutritional profiles of our farm produce
            </p>
          </div>
        </div>

        {isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-2xl" />
            ))}
          </div>
        )}

        {error && <ErrorState onRetry={() => refetch()} />}

        {data && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((item) => (
              <Card key={item.id} className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg">Nutrition Profile</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-2 text-sm">
                  {item.calories && <span>Calories: {item.calories} kcal</span>}
                  {item.protein && <span>Protein: {item.protein}g</span>}
                  {item.carbs && <span>Carbs: {item.carbs}g</span>}
                  {item.fat && <span>Fat: {item.fat}g</span>}
                  {item.fiber && <span>Fiber: {item.fiber}g</span>}
                  {item.vitamins && <span className="col-span-2">Vitamins: {item.vitamins}</span>}
                  {item.minerals && <span className="col-span-2">Minerals: {item.minerals}</span>}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && !error && !data?.length && (
          <p className="text-center text-muted-foreground py-16">
            Nutrition database will be populated soon.
          </p>
        )}
      </div>
    </PublicLayout>
  );
}
