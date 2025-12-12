import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Specify protected route patterns
const protectedRoutes = [
  "/overview",
  "/settings",
  "/workflow",
  "/approval-queue",
  "/editor",
  "/template",
  "/workflow-editor",
  "/documents",
];

const publicRoutes = ["/login"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("cred-crm-ticket-tok")?.value;
  const { pathname } = req.nextUrl;

  // Check if current path starts with any protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Redirect to login if accessing protected route without token
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", req.url);
    const callbackUrl = req.nextUrl.pathname + req.nextUrl.search;
    loginUrl.searchParams.set("callbackUrl", callbackUrl);

    return NextResponse.redirect(loginUrl);
  }

  // Redirect to overview if logged in user tries to access login page
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL("/overview", req.url));
  }

  return NextResponse.next();
}

// Apply middleware to protected routes
export const config = {
  matcher: [
    "/overview/:path*",
    "/settings/:path*",
    "/workflow/:path*",
    "/workflow-editor/:path*",
    "/editor/:path*",
    "/approval-queue/:path*",
    "/documents/:path*",
    "/template/:path*",
  ],
};
