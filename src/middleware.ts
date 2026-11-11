import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith("/admin")) return NextResponse.next();
  if (pathname === "/admin/login") return NextResponse.next();

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET ?? "dev-woodcraft-secret-change-me",
  });

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  const role = token.role as string | undefined;
  if (role !== "ADMIN" && role !== "STAFF") {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // Staff cannot open products/settings CRUD
  if (
    role === "STAFF" &&
    (pathname.startsWith("/admin/products") ||
      pathname.startsWith("/admin/settings") ||
      pathname.startsWith("/admin/discounts"))
  ) {
    return NextResponse.redirect(new URL("/admin/orders", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
