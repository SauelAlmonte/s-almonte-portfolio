import { auth } from "@/auth";
import { NextResponse } from "next/server";

/** Next.js 16+: `middleware` renamed to `proxy` (same matcher + auth behavior). */
export const proxy = auth((req) => {
  const isLoggedIn = !!req.auth;
  const isLoginPage = req.nextUrl.pathname === "/admin/login";

  if (!isLoginPage && !isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
