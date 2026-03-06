"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function ResetPasswordInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const emailFromQuery = searchParams.get("email") ?? "";

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setEmail(emailFromQuery);
  }, [emailFromQuery]);

  const disabled = !email;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    if (!/^\d{6}$/.test(otp)) {
      setError("OTP must be 6 digits.");
      return;
    }
    if (
      password.length < 8 ||
      !/[A-Za-z]/.test(password) ||
      !/[0-9]/.test(password)
    ) {
      setError(
        "Password must be 8+ characters and include a letter and number.",
      );
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword: password }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error?.message ?? "Unable to reset password.");
        return;
      }

      setMessage("Password updated. Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      console.error(err);
      setError("Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h1 className="mb-1 text-2xl font-semibold">Reset password</h1>
        <p className="text-sm text-gray-600">
          Enter the OTP from your email and choose a new password.
        </p>
      </div>
      {disabled && (
        <p className="text-sm text-red-600">
          Please enter your email or request a new OTP.
        </p>
      )}
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
      <div>
        <label className="mb-1 block text-sm font-medium">New password</label>
        <input
          type="password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">
          Confirm password
        </label>
        <input
          type="password"
          className="input"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          autoComplete="new-password"
          required
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {message && <p className="text-sm text-emerald-600">{message}</p>}
      <button
        type="submit"
        className="btn-primary w-full"
        disabled={loading || disabled}
      >
        {loading ? "Updating..." : "Update password"}
      </button>
      <p className="mt-2 text-center text-sm text-gray-600">
        Back to{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:underline"
        >
          login
        </Link>
      </p>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-sm text-gray-600">Loading…</div>}>
      <ResetPasswordInner />
    </Suspense>
  );
}
