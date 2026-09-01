"use client";

import { ProductGrid } from "@/components/product/product-grid";
import { HomeImagesCarousel } from "@/components/home/home-images-carousel";
import { productService } from "@/services/product.service";

export function HomeProductSections() {
  return (
    <>
      <HomeImagesCarousel />

      <div className="container mx-auto px-4 py-16">
        <ProductGrid
          title="Featured Seasonal Products"
          queryKey="seasonal"
          fetchFn={productService.getSeasonal}
        />
      </div>

      <div className="container mx-auto px-4 py-16 bg-muted/30 rounded-3xl my-8">
        <ProductGrid
          title="Trending Products"
          queryKey="trending"
          fetchFn={productService.getTrending}
        />
      </div>

      <div className="container mx-auto px-4 py-16">
        <ProductGrid
          title="Recently Added"
          queryKey="recent"
          fetchFn={productService.getRecent}
        />
      </div>

      <div className="container mx-auto px-4 py-16">
        <ProductGrid
          title="GI Tagged Products"
          queryKey="gi-tagged"
          fetchFn={productService.getGiTagged}
        />
      </div>
    </>
  );
}
