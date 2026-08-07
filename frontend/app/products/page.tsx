"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { PublicLayout } from "@/components/layout/public-layout";
import { ProductGrid } from "@/components/product/product-grid";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts } from "@/hooks/useProducts";
import type { ProductFilters } from "@/types/product";

function ProductsContent() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<ProductFilters>({
    search: searchParams.get("q") || "",
    categoryId: searchParams.get("category") || "",
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
    limit: 12,
  });

  const { data, isLoading, error, refetch } = useProducts(filters);

  const updateFilter = (key: keyof ProductFilters, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-10"
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
          />
        </div>
        <Select
          value={filters.sortBy}
          onChange={(e) => updateFilter("sortBy", e.target.value)}
          className="w-full md:w-48"
        >
          <option value="createdAt">Newest</option>
          <option value="price">Price</option>
          <option value="name">Name</option>
          <option value="rating">Rating</option>
        </Select>
        <Select
          value={filters.sortOrder}
          onChange={(e) => updateFilter("sortOrder", e.target.value as "asc" | "desc")}
          className="w-full md:w-36"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </Select>
        <Button
          variant={filters.isGiTagged ? "default" : "outline"}
          onClick={() =>
            setFilters((prev) => ({
              ...prev,
              isGiTagged: !prev.isGiTagged,
              page: 1,
            }))
          }
        >
          GI Tagged
        </Button>
      </div>

      <ProductGrid
        products={data?.data}
        isLoading={isLoading}
        error={!!error}
        onRetry={() => refetch()}
      />

      {data && data.totalPages > 1 && (
        <Pagination
          page={data.page}
          totalPages={data.totalPages}
          onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
          className="mt-8"
        />
      )}
    </>
  );
}

export default function ProductsPage() {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">All Products</h1>
        <Suspense fallback={<Skeleton className="h-64 rounded-2xl" />}>
          <ProductsContent />
        </Suspense>
      </div>
    </PublicLayout>
  );
}
