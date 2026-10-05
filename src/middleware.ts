import { NextRequest, NextResponse } from "next/server";
import { COOKIE, verifySession } from "@/lib/session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isLogin = pathname === "/admin/login" || pathname === "/api/admin/login";
  const signedIn = await verifySession(req.cookies.get(COOKIE)?.value);

  if (isLogin) {
    if (signedIn && pathname === "/admin/login") return NextResponse.redirect(new URL("/admin", req.url));
    return NextResponse.next();
  }
  if (signedIn) return NextResponse.next();
  if (pathname.startsWith("/api/")) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  return NextResponse.redirect(new URL("/admin/login", req.url));
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
