import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// This does a lightweight check (does a session cookie exist?), not a full
// database lookup — middleware runs on Next.js's Edge runtime, which can't
// use Prisma directly. The real, authoritative session check happens
// server-side on the /admin page itself. This middleware's job is just to
// bounce obviously-logged-out visitors before they see any admin UI at all.

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Never gate the login page itself, or nobody could ever reach it to
  // sign in in the first place.
  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};