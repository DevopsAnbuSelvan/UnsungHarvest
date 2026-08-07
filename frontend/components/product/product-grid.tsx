"use client";

import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/product/product-card";
import { ProductCardSkeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import type { Product } from "@/types/product";

interface ProductGridProps {
  products?: Product[];
  queryKey?: string;
  fetchFn?: () => Promise<Product[]>;
  title?: string;
  isLoading?: boolean;
  error?: boolean;
  onRetry?: () => void;
}

export function ProductGrid({
  products: propProducts,
  queryKey,
  fetchFn,
  title,
  isLoading: propLoading,
  error: propError,
  onRetry,
}: ProductGridProps) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKey ? ["products", queryKey] : ["products", "static"],
    queryFn: fetchFn!,
    enabled: !!fetchFn && !propProducts,
  });

  const products = propProducts ?? data;
  const loading = propLoading ?? (fetchFn && !propProducts ? isLoading : false);
  const hasError = propError ?? (fetchFn && !propProducts ? !!error : false);

  if (loading) {
    return (
      <section className="space-y-6">
        {title && <h2 className="text-2xl font-bold">{title}</h2>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (hasError) {
    return <ErrorState onRetry={onRetry || (() => refetch())} />;
  }

  if (!products?.length) {
    return (
      <section className="space-y-6">
        {title && <h2 className="text-2xl font-bold">{title}</h2>}
        <p className="text-muted-foreground text-center py-12">
          No products found.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      {title && <h2 className="text-2xl font-bold">{title}</h2>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
