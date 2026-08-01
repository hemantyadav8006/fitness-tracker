import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const AUTH_COOKIE = "auth_token";

/** Dashboard app routes — require a valid JWT cookie at the edge. */
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/workouts",
  "/habits",
  "/progress",
] as const;

/**
 * Auth endpoints that are brute-force / enumeration sensitive.
 * Limits are per IP + route, fixed window.
 */
const AUTH_RATE_LIMITS: Record<string, { limit: number; windowMs: number }> = {
  "/api/auth/login": { limit: 10, windowMs: 15 * 60 * 1000 },
  "/api/auth/register": { limit: 5, windowMs: 15 * 60 * 1000 },
  "/api/auth/verify-otp": { limit: 10, windowMs: 15 * 60 * 1000 },
  "/api/auth/resend-otp": { limit: 5, windowMs: 15 * 60 * 1000 },
  "/api/auth/forgot-password": { limit: 5, windowMs: 15 * 60 * 1000 },
  "/api/auth/verify-reset-otp": { limit: 10, windowMs: 15 * 60 * 1000 },
  "/api/auth/reset-password": { limit: 5, windowMs: 15 * 60 * 1000 },
};

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function getJwtSecret(): Uint8Array | null {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

async function hasValidAuthToken(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(AUTH_COOKIE)?.value;
  if (!token) return false;

  const secret = getJwtSecret();
  if (!secret) return false;

  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

function rateLimitResponse(retryAfterSec: number): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: {
        message: "Too many requests. Please try again later.",
        code: "RATE_LIMITED",
      },
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfterSec),
        "Cache-Control": "no-store",
      },
    },
  );
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // --- Rate limit sensitive auth APIs ---
  const authLimit = AUTH_RATE_LIMITS[pathname];
  if (authLimit && req.method === "POST") {
    const ip = getClientIp(req.headers);
    const result = rateLimit(
      `${ip}:${pathname}`,
      authLimit.limit,
      authLimit.windowMs,
    );
    if (!result.success) {
      return rateLimitResponse(result.retryAfterSec);
    }
  }

  // --- Edge auth gate for app pages ---
  if (isProtectedPath(pathname)) {
    const ok = await hasValidAuthToken(req);
    if (!ok) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/workouts/:path*",
    "/habits/:path*",
    "/progress/:path*",
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/verify-otp",
    "/api/auth/resend-otp",
    "/api/auth/forgot-password",
    "/api/auth/verify-reset-otp",
    "/api/auth/reset-password",
  ],
};
