"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function VerifyOtpInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const emailFromQuery = searchParams.get("email") ?? "";
  const newFromQuery = searchParams.get("new") ?? "";

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (emailFromQuery) {
      setEmail(emailFromQuery);
    }
  }, [emailFromQuery]);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    if (!/^\d{6}$/.test(otp)) {
      setError("OTP must be 6 digits.");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error?.message ?? "Unable to verify OTP.");
        return;
      }
      setMessage("Email verified. Redirecting to login…");
      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (err) {
      console.error(err);
      setError("Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!email) {
      setError("Please enter your email first.");
      return;
    }
    setResending(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error?.message ?? "Unable to resend OTP.");
        return;
      }
      setMessage("If an account exists, a new OTP has been sent.");
    } catch (err) {
      console.error(err);
      setError("Unexpected error");
    } finally {
      setResending(false);
    }
  }

  return (
    <form onSubmit={handleVerify} className="space-y-4">
      <div>
        <h1 className="mb-1 text-2xl font-semibold">Verify your email</h1>
        <p className="text-sm text-gray-600">
          Enter the OTP we sent to your email address.
        </p>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Email</label>
        <input
          type="email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">OTP</label>
        <input
          inputMode="numeric"
          className="input"
          value={otp}
          onChange={(e) =>
            setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          autoComplete="one-time-code"
          placeholder="6-digit code"
          required
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {message && <p className="text-sm text-emerald-600">{message}</p>}
      {newFromQuery === "true" ? (
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            className="btn-primary w-full sm:w-auto"
            disabled={resending}
            onClick={handleResend}
          >
            {resending ? "Sending…" : "Send OTP"}
          </button>
          {message === "If an account exists, a new OTP has been sent." && (
            <button
              type="submit"
              className="btn-primary w-full sm:w-auto"
              disabled={loading}
            >
              {loading ? "Verifying…" : "Verify OTP"}
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="submit"
            className="btn-primary w-full sm:w-auto"
            disabled={loading}
          >
            {loading ? "Verifying…" : "Verify OTP"}
          </button>
          <button
            type="button"
            className="btn-primary w-full sm:w-auto"
            disabled={resending}
            onClick={handleResend}
          >
            {resending ? "Resending…" : "Resend OTP"}
          </button>
        </div>
      )}
    </form>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="text-sm text-gray-600">Loading…</div>}>
      <VerifyOtpInner />
    </Suspense>
  );
}
