import { Card } from "@/components/ui/card";

const steps = [
  {
    title: "Create your account",
    description: "Set up in seconds and personalize your goals.",
    icon: "✨",
  },
  {
    title: "Log workouts & nutrition",
    description: "Quick entries that don’t interrupt your day.",
    icon: "🧾",
  },
  {
    title: "Track progress and improve",
    description: "See trends and stay motivated week after week.",
    icon: "🏁",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          How it works
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-foreground/70">
          A simple loop: log → learn → improve.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((s, idx) => (
          <Card key={s.title} className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted text-lg">
                <span aria-hidden="true">{s.icon}</span>
              </div>
              <div className="text-xs font-medium text-foreground/50">
                Step {idx + 1}
              </div>
            </div>
            <h3 className="mt-4 text-lg font-medium">{s.title}</h3>
            <p className="mt-1 text-sm text-foreground/70">{s.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
