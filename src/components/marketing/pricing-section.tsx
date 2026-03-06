import Link from "next/link";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

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
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Simple pricing
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-foreground/70">
          Start free. Upgrade when you want more insight.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((p) => (
          <Card
            key={p.name}
            className={cn(
              "p-5",
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
                <div className="text-2xl font-semibold">{p.price}</div>
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
              href={p.primary ? ("/register" as any) : ("/register" as any)}
              className={cn(
                "mt-5 inline-flex h-10 w-full items-center justify-center rounded-full px-4 text-sm font-medium",
                "transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                p.primary
                  ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md"
                  : "border border-border/70 bg-background/70 text-foreground shadow-sm hover:bg-muted",
              )}
            >
              {p.cta}
            </Link>
          </Card>
        ))}
      </div>
    </section>
  );
}
