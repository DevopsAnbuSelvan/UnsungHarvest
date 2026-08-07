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

const ROLE_PATHS: Record<string, string> = {
  BUYER: "/buyer",
  SELLER: "/seller",
  SUPER_COLD_ADMIN: "/admin",
};

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  if (pathname.startsWith("/products/")) return true;
  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("unsung-harvest-auth")?.value;

  let isAuthenticated = false;
  let userRole: string | null = null;

  if (token) {
    try {
      const parsed = JSON.parse(token);
      isAuthenticated = !!parsed?.state?.accessToken;
      userRole = parsed?.state?.user?.role || null;
    } catch {
      isAuthenticated = false;
    }
  }

  if (isPublicPath(pathname)) {
    if (
      isAuthenticated &&
      (pathname === "/login" || pathname === "/register")
    ) {
      const dashboard =
        userRole === "SELLER"
          ? "/seller/dashboard"
          : userRole === "SUPER_COLD_ADMIN"
            ? "/admin/dashboard"
            : "/buyer/dashboard";
      return NextResponse.redirect(new URL(dashboard, request.url));
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
  if (pathname.startsWith("/admin") && userRole !== "SUPER_COLD_ADMIN") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
