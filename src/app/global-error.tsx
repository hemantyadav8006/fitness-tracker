"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

/**
 * Root layout failure fallback. Must define its own <html>/<body> and cannot
 * rely on ThemeProvider or shared layout CSS reliably — use inline styles
 * aligned with FitTrack dark + lime tokens.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  const showDetails =
    typeof process !== "undefined" && process.env.NODE_ENV === "development";

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f1218",
          color: "#f4f1ea",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: 420, textAlign: "center" }}>
          <p
            style={{
              margin: 0,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#b8ff40",
            }}
          >
            FitTrack
          </p>
          <h1
            style={{
              margin: "12px 0 0",
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            Something went wrong
          </h1>
          <p
            style={{
              margin: "12px 0 0",
              fontSize: 14,
              lineHeight: 1.5,
              color: "rgba(244, 241, 234, 0.65)",
            }}
          >
            The app failed to load. Please try again. If this keeps happening,
            come back in a few minutes.
          </p>
          {showDetails && error.message ? (
            <pre
              style={{
                marginTop: 16,
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.04)",
                fontSize: 11,
                textAlign: "left",
                overflow: "auto",
                color: "rgba(244, 241, 234, 0.7)",
              }}
            >
              {error.message}
            </pre>
          ) : null}
          <div
            style={{
              marginTop: 28,
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              justifyContent: "center",
            }}
          >
            <button
              type="button"
              onClick={() => reset()}
              style={{
                height: 36,
                padding: "0 16px",
                borderRadius: 12,
                border: "none",
                background: "#b8ff40",
                color: "#0f1218",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            <a
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                height: 36,
                padding: "0 16px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.16)",
                background: "rgba(255,255,255,0.06)",
                color: "#f4f1ea",
                fontWeight: 500,
                fontSize: 14,
                textDecoration: "none",
              }}
            >
              Go home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
