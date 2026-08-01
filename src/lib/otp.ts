import { createHash, randomInt, timingSafeEqual } from "crypto";

/** OTP lifetime used for email verification and password reset. */
export const OTP_TTL_MS = 10 * 60 * 1000;

/** Cryptographically secure 6-digit OTP (000000–999999). */
export function generateOTP(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

/** One-way hash for OTPs at rest (never store the plaintext code). */
export function hashOtp(otp: string): string {
  return createHash("sha256").update(otp).digest("hex");
}

/**
 * Constant-time compare of a plaintext OTP against a stored SHA-256 hex hash.
 * Returns false on missing/malformed stored values instead of throwing.
 */
export function verifyOtpHash(
  plainOtp: string,
  storedHash: string | null | undefined,
): boolean {
  if (!storedHash) return false;

  const hashed = hashOtp(plainOtp);
  try {
    const a = Buffer.from(hashed, "utf8");
    const b = Buffer.from(storedHash, "utf8");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function otpExpiryFromNow(ttlMs: number = OTP_TTL_MS): Date {
  return new Date(Date.now() + ttlMs);
}
