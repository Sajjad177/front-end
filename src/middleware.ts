import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROUTES } from "@/constants/routes";

// Define path categories
const AUTH_ROUTES = Object.values(ROUTES.AUTH) as string[];
const PROTECTED_PREFIX = "/dashboard";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Retrieve token from cookies (which is how production SSR auth works)
  const token = request.cookies.get("saas_auth_token")?.value;
  const isAuthenticated = !!token;

  // 1. Redirect authenticated users away from auth pages (e.g. login)
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL(ROUTES.DASHBOARD.OVERVIEW, request.url));
    }
    return NextResponse.next();
  }

  // 2. Redirect unauthenticated users away from protected pages
  if (pathname.startsWith(PROTECTED_PREFIX)) {
    if (!isAuthenticated) {
      const loginUrl = new URL(ROUTES.AUTH.LOGIN, request.url);
      // Pass back original URL for post-login redirection
      loginUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Configure routes to run middleware on (excluding assets and API paths)
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|assets).*)",
  ],
};
