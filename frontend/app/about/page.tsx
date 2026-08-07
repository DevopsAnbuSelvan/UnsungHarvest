import { PublicLayout } from "@/components/layout/public-layout";
import { Leaf, Heart, Users, Globe } from "lucide-react";

export const metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold mb-6">About Unsung Harvest</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Unsung Harvest is a marketplace connecting Indian farmers directly with
            consumers. We celebrate seasonal produce, GI-tagged specialties, and the
            rich nutritional heritage of Indian agriculture.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Leaf, title: "Farm Fresh", desc: "Direct from farmers to your table" },
            { icon: Heart, title: "Fair Trade", desc: "Farmers get fair prices for their produce" },
            { icon: Users, title: "Community", desc: "Building a sustainable farming ecosystem" },
            { icon: Globe, title: "Local Heritage", desc: "Preserving GI-tagged regional products" },
          ].map((item) => (
            <div key={item.title} className="glass-card rounded-2xl p-6 text-center">
              <item.icon className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
