"use client";

import { ProductGrid } from "@/components/product/product-grid";
import { productService } from "@/services/product.service";

export function GiTaggedProductGrid() {
  return (
    <ProductGrid
      queryKey="gi-tagged"
      fetchFn={productService.getGiTagged}
    />
  );
}
