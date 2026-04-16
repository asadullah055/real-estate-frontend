import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export async function proxy(request: NextRequest) {
  // Forward all cookies so Better Auth can read the session cookie
  let body: { user?: { emailVerified?: boolean; email?: string } } | null = null;

  try {
    const sessionRes = await fetch(`${API_URL}/api/auth/get-session`, {
      headers: { cookie: request.headers.get("cookie") ?? "" },
      cache: "no-store",
    });

    if (!sessionRes.ok) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    body = await sessionRes.json().catch(() => null);
  } catch {
    // Backend unreachable — redirect to login rather than crashing with 500
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const user = body?.user ?? null;

  // Not logged in → send to login
  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Logged in but email not verified → send to verify-email page
  if (!user.emailVerified) {
    const verifyUrl = new URL("/verify-email", request.url);
    if (user.email) verifyUrl.searchParams.set("email", user.email);
    return NextResponse.redirect(verifyUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Protect all /dashboard routes
  matcher: ["/dashboard/:path*"],
};
