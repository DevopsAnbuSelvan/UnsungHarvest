import { PublicLayout } from "@/components/layout/public-layout";
import { SeasonalProductGrid } from "@/components/product/seasonal-product-grid";

export const metadata = { title: "Seasonal Products" };

export default function SeasonalProductsPage() {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Seasonal Products</h1>
        <p className="text-muted-foreground mb-8">
          Fresh produce harvested at peak season for the best taste and nutrition.
        </p>
        <SeasonalProductGrid />
      </div>
    </PublicLayout>
  );
}
