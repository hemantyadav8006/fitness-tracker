import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

const features = [
  {
    title: "Workout Tracking",
    description: "Log exercises and monitor performance over time.",
    icon: "🏋︎",
  },
  {
    title: "Calorie Counter",
    description: "Track daily calories and nutrition with clarity.",
    icon: "🔥",
  },
  {
    title: "Progress Analytics",
    description: "Visual charts that make improvement obvious.",
    icon: "📈",
  },
  {
    title: "Goal Setting",
    description: "Set daily/weekly fitness goals that stick.",
    icon: "🎯",
  },
];

export function FeatureSection() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Everything you need to stay consistent
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-foreground/70">
          Minimal inputs, maximum insight—built to feel fast, calm, and
          rewarding.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <Card
            key={f.title}
            className={cn(
              "group p-5 shadow-sm",
              "transition-all duration-200 hover:-translate-y-1 hover:shadow-md",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-lg">
                <span aria-hidden="true">{f.icon}</span>
              </div>
              <div
                className={cn(
                  "h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-transparent opacity-0",
                  "transition-opacity duration-200 group-hover:opacity-100",
                )}
                aria-hidden="true"
              />
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium">{f.title}</h3>
              <p className="mt-1 text-sm text-foreground/70">{f.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
