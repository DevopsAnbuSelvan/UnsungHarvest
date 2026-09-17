"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  Users,
  Package,
  FolderTree,
  Calendar,
  Apple,
  Award,
  MapPin,
  ShoppingBag,
  FileText,
  Settings,
  Shield,
  LogOut,
  Menu,
  Sprout,
  CreditCard,
  UserCog,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { performLogout } from "@/utils/logout";
import { cn } from "@/lib/utils";

/** Super Cold Admin panel — includes staff management */
const superColdNav = [
  { href: "/super-cold-admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/super-cold-admin/staff", label: "Manage Admins", icon: UserCog },
  { href: "/admin/sellers", label: "Manage Sellers", icon: Store },
  { href: "/admin/farmers", label: "Manage Farmers", icon: Sprout },
  { href: "/admin/buyers", label: "Manage Buyers", icon: Users },
  { href: "/admin/products", label: "Manage Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/season-calendar", label: "Seasons", icon: Calendar },
  { href: "/admin/nutrition", label: "Nutrition DB", icon: Apple },
  { href: "/admin/gi-tags", label: "GI Tag DB", icon: Award },
  { href: "/admin/locations", label: "Locations", icon: MapPin },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/reports", label: "Reports", icon: FileText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function SuperColdAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await performLogout();
  };

  return (
    <div className="flex min-h-screen">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform lg:translate-x-0 lg:static",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-bold text-sm">Super Cold Admin</span>
        </div>
        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-8rem)]">
          {superColdNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            <LogOut className="h-4 w-4" />
            {loggingOut ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b flex items-center px-4 lg:px-8 gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold capitalize">
            {pathname.split("/").pop()?.replace("-", " ") || "Dashboard"}
          </h1>
        </header>
        <main className="flex-1 p-4 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
