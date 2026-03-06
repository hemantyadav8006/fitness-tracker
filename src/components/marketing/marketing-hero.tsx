import Link from "next/link";
import { HeroDashboardMock } from "./mock/hero-dashboard-mock";
import { cn } from "@/lib/cn";

function PrimaryButtonLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href as any}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm",
        "transition-all duration-200 hover:shadow-md hover:bg-primary/90",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
      )}
    >
      {label}
    </Link>
  );
}

function SecondaryButtonLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href as any}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-full border border-border/70 bg-background/70 px-5 text-sm font-medium text-foreground shadow-sm backdrop-blur",
        "transition-all duration-200 hover:bg-muted",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
      )}
    >
      {label}
    </Link>
  );
}

export function MarketingHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-72 w-[52rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-primary/15 via-primary/10 to-transparent blur-3xl" />
        <div className="absolute -bottom-40 right-[-10rem] h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs font-medium text-foreground/70 shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Built for consistency, not chaos
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
            Track Your Fitness.{" "}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Transform Your Life.
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-sm text-foreground/70 sm:text-base">
            Monitor workouts, calories, weight, and progress in one powerful
            dashboard—designed to keep you focused, motivated, and improving.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <PrimaryButtonLink href="/register" label="Start Tracking Free" />
            <SecondaryButtonLink href="#preview" label="See Demo" />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-foreground/60">
            <div className="rounded-full border border-border/60 bg-background/60 px-3 py-1 shadow-sm">
              Workout logs
            </div>
            <div className="rounded-full border border-border/60 bg-background/60 px-3 py-1 shadow-sm">
              Progress charts
            </div>
            <div className="rounded-full border border-border/60 bg-background/60 px-3 py-1 shadow-sm">
              Habit streaks
            </div>
          </div>
        </div>

        <div className="relative">
          <HeroDashboardMock />
        </div>
      </div>
    </section>
  );
}
