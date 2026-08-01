"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { MotionItem, MotionReveal, MotionStagger } from "@/components/motion-reveal";

const plans = [
  {
    name: "Free",
    price: "$0",
    tagline: "Start tracking today",
    features: ["Workout logging", "Basic charts", "Habit streaks"],
    cta: "Get Started",
    primary: false,
  },
  {
    name: "Pro",
    price: "$9",
    tagline: "For serious consistency",
    features: ["Advanced analytics", "Goal templates", "Priority support"],
    cta: "Start Pro",
    primary: true,
  },
  {
    name: "Team",
    price: "$19",
    tagline: "For coaches & groups",
    features: ["Shared dashboards", "Program tracking", "Admin controls"],
    cta: "Contact",
    primary: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <MotionReveal className="mb-8">
        <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Simple pricing
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-foreground/70">
          Start free. Upgrade when you want more insight.
        </p>
      </MotionReveal>

      <MotionStagger className="grid gap-4 md:grid-cols-3">
        {plans.map((p) => (
          <MotionItem key={p.name}>
            <Card
              className={cn(
                "flex h-full flex-col p-5",
                p.primary &&
                  "border-primary/30 bg-gradient-to-b from-primary/10 to-transparent",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">{p.name}</div>
                  <div className="mt-1 text-xs text-foreground/60">
                    {p.tagline}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display text-2xl font-semibold">
                    {p.price}
                  </div>
                  <div className="text-xs text-foreground/60">/ month</div>
                </div>
              </div>

              <ul className="mt-4 space-y-2 text-sm text-foreground/70">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span aria-hidden="true" className="text-primary">
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={"/register" as any}
                className={cn(
                  "mt-auto inline-flex h-10 w-full items-center justify-center rounded-xl px-4 text-sm font-medium pt-5",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  p.primary
                    ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                    : "border border-border/60 bg-background/50 text-foreground backdrop-blur-md hover:bg-muted/70",
                )}
              >
                {p.cta}
              </Link>
            </Card>
          </MotionItem>
        ))}
      </MotionStagger>
    </section>
  );
}
