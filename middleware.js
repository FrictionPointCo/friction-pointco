import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "./lib/auth";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow the login page and its API endpoints through untouched.
  if (
    pathname === "/admin/login" ||
    pathname === "/api/admin/login" ||
    pathname === "/api/admin/logout"
  ) {
    return NextResponse.next();
  }

  const isAdminArea =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api/products") ||
    pathname.startsWith("/api/admin");
  if (!isAdminArea) {
    return NextResponse.next();
  }

  // Public reads: GET /api/products and GET /api/products/[id] stay open
  // (used by the site itself); only mutations require a session.
  if (
    pathname.startsWith("/api/products") &&
    request.method === "GET"
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const valid = await verifySessionToken(token);

  if (!valid) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/products/:path*", "/api/admin/:path*"],
};
