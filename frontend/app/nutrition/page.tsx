"use client";

import { useQuery } from "@tanstack/react-query";
import { PublicLayout } from "@/components/layout/public-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { nutritionService } from "@/services/nutrition.service";
import type { NutritionInfo } from "@/types/product";
import { Apple } from "lucide-react";

type NutritionCard = NutritionInfo & {
  name?: string;
  servingSize?: string;
  carbohydrates?: number;
};

const STATIC_NUTRITION: NutritionCard[] = [
  {
    id: "static-mango",
    name: "Alphonso Mango",
    servingSize: "100g",
    calories: 60,
    protein: 0.8,
    carbs: 15,
    fat: 0.4,
    fiber: 1.6,
    vitamins: "Vitamin A, Vitamin C",
    minerals: "Potassium, Copper",
  },
  {
    id: "static-banana",
    name: "Nendran Banana",
    servingSize: "100g",
    calories: 89,
    protein: 1.1,
    carbs: 23,
    fat: 0.3,
    fiber: 2.6,
    vitamins: "Vitamin B6, Vitamin C",
    minerals: "Potassium, Magnesium",
  },
  {
    id: "static-tomato",
    name: "Country Tomato",
    servingSize: "100g",
    calories: 18,
    protein: 0.9,
    carbs: 3.9,
    fat: 0.2,
    fiber: 1.2,
    vitamins: "Vitamin C, Vitamin K",
    minerals: "Potassium, Manganese",
  },
  {
    id: "static-spinach",
    name: "Palak (Spinach)",
    servingSize: "100g",
    calories: 23,
    protein: 2.9,
    carbs: 3.6,
    fat: 0.4,
    fiber: 2.2,
    vitamins: "Vitamin A, Vitamin K, Folate",
    minerals: "Iron, Calcium, Magnesium",
  },
  {
    id: "static-millet",
    name: "Finger Millet (Ragi)",
    servingSize: "100g",
    calories: 328,
    protein: 7.3,
    carbs: 72,
    fat: 1.3,
    fiber: 3.6,
    vitamins: "Thiamine, Niacin",
    minerals: "Calcium, Iron, Phosphorus",
  },
  {
    id: "static-turmeric",
    name: "Erode Turmeric",
    servingSize: "100g",
    calories: 354,
    protein: 7.8,
    carbs: 65,
    fat: 9.9,
    fiber: 21,
    vitamins: "Vitamin C, Vitamin E",
    minerals: "Iron, Manganese, Potassium",
  },
  {
    id: "static-coconut",
    name: "Tender Coconut",
    servingSize: "100ml water",
    calories: 19,
    protein: 0.7,
    carbs: 3.7,
    fat: 0.2,
    fiber: 1.1,
    vitamins: "Vitamin C, B Vitamins",
    minerals: "Potassium, Sodium, Magnesium",
  },
  {
    id: "static-drumstick",
    name: "Drumstick (Moringa)",
    servingSize: "100g",
    calories: 37,
    protein: 2.1,
    carbs: 8.5,
    fat: 0.2,
    fiber: 3.2,
    vitamins: "Vitamin A, Vitamin C",
    minerals: "Calcium, Iron, Potassium",
  },
  {
    id: "static-groundnut",
    name: "Groundnut",
    servingSize: "100g",
    calories: 567,
    protein: 25.8,
    carbs: 16,
    fat: 49,
    fiber: 8.5,
    vitamins: "Vitamin E, Niacin, Folate",
    minerals: "Magnesium, Phosphorus, Zinc",
  },
];

function NutritionProfileCard({ item }: { item: NutritionCard }) {
  const carbs = item.carbs ?? item.carbohydrates;

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">
            {item.name || "Nutrition Profile"}
          </CardTitle>
          {item.servingSize && (
            <Badge variant="nutrition">per {item.servingSize}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2 text-sm">
        {item.calories != null && (
          <span>Calories: {item.calories} kcal</span>
        )}
        {item.protein != null && <span>Protein: {item.protein}g</span>}
        {carbs != null && <span>Carbs: {carbs}g</span>}
        {item.fat != null && <span>Fat: {item.fat}g</span>}
        {item.fiber != null && <span>Fiber: {item.fiber}g</span>}
        {item.vitamins && (
          <span className="col-span-2 text-muted-foreground">
            Vitamins: {item.vitamins}
          </span>
        )}
        {item.minerals && (
          <span className="col-span-2 text-muted-foreground">
            Minerals: {item.minerals}
          </span>
        )}
      </CardContent>
    </Card>
  );
}

export default function NutritionPage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["nutrition"],
    queryFn: nutritionService.getAll,
  });

  const items: NutritionCard[] =
    data && data.length > 0 ? data : STATIC_NUTRITION;

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

        {!isLoading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <NutritionProfileCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
