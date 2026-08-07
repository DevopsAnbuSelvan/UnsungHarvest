"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, User, Star, Award, Apple } from "lucide-react";
import { PublicLayout } from "@/components/layout/public-layout";
import { ProductGrid } from "@/components/product/product-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { useProduct } from "@/hooks/useProducts";
import { productService } from "@/services/product.service";
import { formatCurrency } from "@/lib/utils";
import { use } from "react";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: product, isLoading, error, refetch } = useProduct(id);

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <Skeleton className="h-96 rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (error || !product) {
    return (
      <PublicLayout>
        <ErrorState onRetry={() => refetch()} />
      </PublicLayout>
    );
  }

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <div className="space-y-4">
            <div className="relative h-96 rounded-2xl overflow-hidden bg-muted">
              <Image
                src={product.images[0] || "/placeholder-product.svg"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((img, i) => (
                  <div key={i} className="relative h-20 w-20 rounded-lg overflow-hidden shrink-0">
                    <Image src={img} alt="" fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {product.isGiTagged && <Badge variant="gi">GI Tagged</Badge>}
                {product.nutrition && <Badge variant="nutrition">Nutrition Info</Badge>}
                {product.season?.map((s) => (
                  <Badge key={s} variant="season">{s}</Badge>
                ))}
              </div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              {product.localName && (
                <p className="text-muted-foreground italic mt-1">{product.localName}</p>
              )}
              <p className="text-3xl font-bold text-primary mt-4">
                {formatCurrency(product.price)}
              </p>
              {product.rating && (
                <div className="flex items-center gap-1 mt-2">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium">{product.rating}</span>
                  <span className="text-muted-foreground text-sm">
                    ({product.reviewCount} reviews)
                  </span>
                </div>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {product.nutrition && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Apple className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Nutrition (per 100g)</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {product.nutrition.calories && <span>Calories: {product.nutrition.calories}</span>}
                    {product.nutrition.protein && <span>Protein: {product.nutrition.protein}g</span>}
                    {product.nutrition.carbs && <span>Carbs: {product.nutrition.carbs}g</span>}
                    {product.nutrition.fiber && <span>Fiber: {product.nutrition.fiber}g</span>}
                  </div>
                </CardContent>
              </Card>
            )}

            {product.isGiTagged && product.giTagNumber && (
              <div className="flex items-center gap-2 text-sm">
                <Award className="h-4 w-4 text-amber-500" />
                GI Tag: {product.giTagNumber}
              </div>
            )}

            <div>
              <h3 className="font-semibold mb-2">Available Months</h3>
              <div className="flex flex-wrap gap-1">
                {product.availabilityMonths.map((m) => (
                  <Badge key={m} variant="outline">{months[m - 1]}</Badge>
                ))}
              </div>
            </div>

            {product.cultivationPlace && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                Cultivated at: {product.cultivationPlace}
              </div>
            )}

            {product.seller && (
              <Card className="glass-card">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">
                      {product.seller.farmName || `${product.seller.firstName} ${product.seller.lastName}`}
                    </p>
                    {product.location && (
                      <p className="text-sm text-muted-foreground">
                        {product.location.name}, {product.location.state}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <Link href="/buyer/cart">
              <Button size="lg" className="w-full">Add to Cart</Button>
            </Link>
          </div>
        </div>

        <ProductGrid
          title="Related Products"
          queryKey={`related-${id}`}
          fetchFn={() => productService.getRelated(id)}
        />
      </div>
    </PublicLayout>
  );
}
