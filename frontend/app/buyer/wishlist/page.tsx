"use client";

import { useQuery } from "@tanstack/react-query";
import { BuyerLayout } from "@/components/layout/buyer-layout";
import { ProductGrid } from "@/components/product/product-grid";
import { wishlistService } from "@/services/wishlist.service";

export default function WishlistPage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["wishlist"],
    queryFn: wishlistService.getAll,
  });

  return (
    <BuyerLayout>
      <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>
      <ProductGrid
        products={data?.map((w) => w.product)}
        isLoading={isLoading}
        error={!!error}
        onRetry={() => refetch()}
      />
    </BuyerLayout>
  );
}
