import Link from "next/link";
import { Leaf, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  shop: [
    { href: "/products", label: "All Products" },
    { href: "/products/seasonal", label: "Seasonal" },
    { href: "/products/gi-tagged", label: "GI Tagged" },
    { href: "/nutrition", label: "Nutrition Info" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/register", label: "Become a Seller" },
  ],
  account: [
    { href: "/login", label: "Login" },
    { href: "/register", label: "Register" },
    { href: "/buyer/orders", label: "My Orders" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
              <Leaf className="h-6 w-6" />
              Unsung Harvest
            </Link>
            <p className="text-sm text-muted-foreground">
              Connecting farmers directly to consumers. Fresh, seasonal, and
              GI-tagged produce from across India.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                hello@unsungharvest.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                +91 98765 43210
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Bengaluru, Karnataka
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Unsung Harvest. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
