import Link from "next/link";
import { cn } from "@/lib/cn";

export function CtaSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6">
      <div
        className={cn(
          "rounded-2xl border border-border/60 p-8 shadow-sm",
          "bg-gradient-to-br from-primary/15 via-background to-background",
        )}
      >
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Start Your Fitness Journey Today
            </h2>
            <p className="mt-2 max-w-xl text-sm text-foreground/70">
              Build momentum with a dashboard designed for focus, not friction.
            </p>
          </div>
          <Link
            href={"/register" as any}
            className={cn(
              "inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm",
              "transition-all duration-200 hover:bg-primary/90 hover:shadow-md",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            )}
          >
            Create Free Account
          </Link>
        </div>
      </div>
    </section>
  );
}
