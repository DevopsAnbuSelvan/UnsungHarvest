import Link from "next/link";
import { ArrowRight, Leaf, MapPin, Award, Apple } from "lucide-react";
import { PublicLayout } from "@/components/layout/public-layout";
import { HomeProductSections } from "@/components/home/home-product-sections";
import { Button } from "@/components/ui/button";
import { categoryService } from "@/services/category.service";

export default function HomePage() {
  return (
    <PublicLayout>
      <section className="hero-gradient text-white">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-2xl animate-fade-in-up">
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="h-6 w-6" />
              <span className="text-sm font-medium opacity-90">Farm to Table</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Fresh Harvest from India&apos;s Unsung Farmers
            </h1>
            <p className="text-lg opacity-90 mb-8">
              Discover seasonal produce, GI-tagged specialties, and nutrition-rich
              crops directly from local farmers across India.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products">
                <Button size="lg" variant="secondary">
                  Explore Products
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="glass">
                  Become a Seller
                </Button>
              </Link>
              <Link href="#our-works">
                <Button size="lg" variant="glass">
                  Our Works
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <HomeProductSections />

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8">Shop by Category</h2>
        <CategorySection />
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="rounded-3xl overflow-hidden glass-card p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <MapPin className="h-8 w-8 text-primary mb-4" />
              <h2 className="text-2xl font-bold mb-4">Explore by Region</h2>
              <p className="text-muted-foreground mb-6">
                Discover produce from different regions of India. Each product
                tells a story of its origin, cultivation practices, and local heritage.
              </p>
              <Link href="/products">
                <Button>View on Map</Button>
              </Link>
            </div>
            <div className="h-64 lg:h-80 rounded-2xl bg-muted flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Interactive map coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 mb-8">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Apple, title: "Nutrition Rich", desc: "Detailed nutrition info for every product" },
            { icon: Leaf, title: "Seasonal Fresh", desc: "Harvested at peak season for best quality" },
            { icon: Award, title: "GI Certified", desc: "Authentic geographically indicated products" },
          ].map((item) => (
            <div
              key={item.title}
              className="glass-card rounded-2xl p-6 text-center hover:shadow-lg transition-shadow"
            >
              <item.icon className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}

async function CategorySection() {
  let categories: Awaited<ReturnType<typeof categoryService.getAll>> = [];
  try {
    categories = await categoryService.getAll();
  } catch {
    categories = [
      { id: "1", name: "Fruits", slug: "fruits" },
      { id: "2", name: "Vegetables", slug: "vegetables" },
      { id: "3", name: "Grains", slug: "grains" },
      { id: "4", name: "Spices", slug: "spices" },
    ];
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/products?category=${cat.id}`}
          className="glass-card rounded-2xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all"
        >
          <h3 className="font-semibold">{cat.name}</h3>
          {cat.productCount !== undefined && (
            <p className="text-sm text-muted-foreground mt-1">
              {cat.productCount} products
            </p>
          )}
        </Link>
      ))}
    </div>
  );
}
