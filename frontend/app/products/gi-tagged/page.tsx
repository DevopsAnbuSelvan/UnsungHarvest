import { PublicLayout } from "@/components/layout/public-layout";
import { GiTaggedProductGrid } from "@/components/product/gi-tagged-product-grid";

export const metadata = { title: "GI Tagged Products" };

export default function GiTaggedProductsPage() {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">GI Tagged Products</h1>
        <p className="text-muted-foreground mb-8">
          Geographically Indicated products with authentic regional heritage.
        </p>
        <GiTaggedProductGrid />
      </div>
    </PublicLayout>
  );
}
