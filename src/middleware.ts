import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Specify protectedRoutes
const protectedRoutes = [
  "/overview",
  "/settings/workflow",
  "/workflow",
  "/workflow/new",
  "/approval-queue",
  "/settings",
  "/more",
];
const publicRoutes = ["/login"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  const isProtectedRoute = protectedRoutes.includes(pathname);
  const isPublicRoute = publicRoutes.includes(pathname);

  // Public routes
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Protect dashboard routes
  if (isPublicRoute && token && !req.nextUrl.pathname.startsWith("/overview")) {
    return NextResponse.redirect(new URL("/overview", req.url));
  }

  return NextResponse.next();
}

// Apply middleware to protected routes only
export const config = {
  matcher: [
    "/overview/:path*",
    "/settings/:path*",
    "/workflow/:path*",
    "/workflow-editor/:path*",
    "/approval-queue/:path*",
    "/settings/:path*",
  ],
};
