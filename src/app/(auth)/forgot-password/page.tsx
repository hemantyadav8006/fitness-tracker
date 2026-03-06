"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.error?.message ?? "Something went wrong");
        return;
      }

      setMessage("OTP sent to email. Redirecting...");
      setTimeout(() => {
        router.push(
          `/reset-password?email=${encodeURIComponent(email)}` as any,
        );
      }, 800);
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
        <h1 className="mb-1 text-2xl font-semibold">Forgot password</h1>
        <p className="text-sm text-gray-600">
          Enter your email and we&apos;ll send you an OTP to reset your
          password.
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
      {error && <p className="text-sm text-red-600">{error}</p>}
      {message && <p className="text-sm text-emerald-600">{message}</p>}
      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading ? "Sending OTP..." : "Send OTP"}
      </button>
      <p className="mt-2 text-center text-sm text-gray-600">
        Remembered your password?{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:underline"
        >
          Back to login
        </Link>
      </p>
    </form>
  );
}
