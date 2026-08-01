import * as Sentry from "@sentry/nextjs";

/**
 * Keys that must never be forwarded to logs or Sentry extras.
 * Callers should only pass safe identifiers (route, userId, etc.).
 */
const BLOCKED_META_KEYS = new Set([
  "password",
  "passwordHash",
  "newPassword",
  "otp",
  "otpHash",
  "otpExpiry",
  "resetPasswordOTP",
  "resetPasswordOTPExpire",
  "token",
  "auth_token",
  "body",
  "payload",
  "EMAIL_PASS",
  "JWT_SECRET",
  "MONGODB_URI",
]);

function sanitizeMeta(
  meta?: Record<string, unknown>,
): Record<string, unknown> | undefined {
  if (!meta) return undefined;
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(meta)) {
    if (BLOCKED_META_KEYS.has(key)) continue;
    out[key] = value;
  }
  return out;
}

function toError(error: unknown): Error {
  if (error instanceof Error) return error;
  return new Error(typeof error === "string" ? error : "Unknown error");
}

/**
 * Structured error logging for API / server code.
 * - Production: Sentry.captureException
 * - Development: console.error with the same context
 * Never pass passwords, OTPs, or full request bodies in `meta`.
 */
export function logError(
  context: string,
  error: unknown,
  meta?: Record<string, unknown>,
): void {
  const err = toError(error);
  const safeMeta = sanitizeMeta(meta);

  if (process.env.NODE_ENV === "production") {
    Sentry.captureException(err, {
      tags: { context },
      extra: safeMeta,
    });
  } else {
    console.error(`[${context}]`, err, safeMeta ?? "");
  }
}
