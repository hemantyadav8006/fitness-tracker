"use client";

import { useEffect } from "react";
import Link from "next/link";
import * as Sentry from "@sentry/nextjs";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  const showDetails = process.env.NODE_ENV === "development";

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        FitTrack
      </p>
      <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
        Something went wrong
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        We hit an unexpected error loading this page. You can try again, or head
        back home.
      </p>
      {showDetails && error.message ? (
        <p className="mt-4 max-w-lg rounded-xl border border-border bg-muted/50 px-3 py-2 font-mono text-xs text-muted-foreground">
          {error.message}
        </p>
      ) : null}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button type="button" variant="primary" onClick={() => reset()}>
          Try again
        </Button>
        <Link
          href="/"
          className="inline-flex h-9 items-center justify-center rounded-xl border border-border bg-secondary px-4 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
