import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/",
  "/about",
  "/products",
  "/nutrition",
  "/contact",
  "/login",
  "/register",
];

function isAdminPanelRole(role: string | null): boolean {
  return role === "ADMIN" || role === "SUPER_COLD_ADMIN";
}

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  if (pathname.startsWith("/products/")) return true;
  return false;
}

function dashboardForRole(role: string | null): string {
  if (role === "SELLER") return "/seller/dashboard";
  if (role === "SUPER_COLD_ADMIN") return "/super-cold-admin/dashboard";
  if (role === "ADMIN") return "/admin/dashboard";
  return "/buyer/dashboard";
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("unsung-harvest-auth")?.value;

  let isAuthenticated = false;
  let userRole: string | null = null;

  if (token) {
    try {
      const decoded = decodeURIComponent(token);
      const parsed = JSON.parse(decoded);
      isAuthenticated = !!parsed?.state?.accessToken;
      userRole = parsed?.state?.user?.role || null;
    } catch {
      try {
        const parsed = JSON.parse(token);
        isAuthenticated = !!parsed?.state?.accessToken;
        userRole = parsed?.state?.user?.role || null;
      } catch {
        isAuthenticated = false;
      }
    }
  }

  if (isPublicPath(pathname)) {
    if (
      isAuthenticated &&
      (pathname === "/login" || pathname === "/register")
    ) {
      return NextResponse.redirect(
        new URL(dashboardForRole(userRole), request.url)
      );
    }
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/buyer") && userRole !== "BUYER") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (pathname.startsWith("/seller") && userRole !== "SELLER") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/super-cold-admin")) {
    if (userRole !== "SUPER_COLD_ADMIN") {
      return NextResponse.redirect(
        new URL(dashboardForRole(userRole), request.url)
      );
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin") && !isAdminPanelRole(userRole)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
