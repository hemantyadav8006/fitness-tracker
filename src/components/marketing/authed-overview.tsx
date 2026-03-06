import Link from "next/link";
import { StatCard } from "@/components/ui/stat-card";
import { Card } from "@/components/ui/card";
import { AuthedCharts } from "./mock/authed-charts";
import { cn } from "@/lib/cn";

function QuickAction({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href as any}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-full border border-border/70 bg-background/70 px-4 text-sm font-medium text-foreground shadow-sm",
        "transition-all duration-200 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
      )}
    >
      {label}
    </Link>
  );
}

export function AuthedOverview({ username }: { username: string }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
      <div className="mb-6">
        <div className="text-xs font-medium uppercase tracking-wide text-foreground/60">
          Dashboard Overview
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
          Welcome back, {username}
        </h1>
        <p className="mt-2 text-sm text-foreground/70">
          A quick snapshot to keep you moving today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Steps Today" value="8,420" description="On track" />
        <StatCard
          label="Calories Consumed"
          value="1,830"
          description="Daily goal 2,200"
        />
        <StatCard
          label="Workouts Completed"
          value="1"
          description="This week"
        />
        <StatCard label="Water Intake" value="1.6 L" description="Goal 2.5 L" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.42fr)]">
        <AuthedCharts />
        <Card className="p-5">
          <h2 className="text-sm font-semibold">Quick actions</h2>
          <p className="mt-1 text-sm text-foreground/70">
            Jump straight into logging.
          </p>
          <div className="mt-4 grid gap-2">
            <QuickAction href="/workouts" label="Log Workout" />
            <QuickAction href="/dashboard" label="Add Meal" />
            <QuickAction href="/progress" label="Add Weight" />
          </div>
          <div className="mt-5 rounded-2xl border border-border/60 bg-muted/40 p-4">
            <div className="text-xs font-medium text-foreground/60">Tip</div>
            <div className="mt-1 text-sm">
              Small logs done daily beat perfect logs done rarely.
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
