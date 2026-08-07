"use client";

import { ProductGrid } from "@/components/product/product-grid";
import { productService } from "@/services/product.service";

export function SeasonalProductGrid() {
  return (
    <ProductGrid
      queryKey="seasonal"
      fetchFn={productService.getSeasonal}
    />
  );
}
