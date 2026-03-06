import { Card } from "@/components/ui/card";

const testimonials = [
  {
    name: "Ava R.",
    quote: "This app completely changed how I track my workouts.",
    avatar: "AR",
  },
  {
    name: "Marcus L.",
    quote: "The dashboard is so clean I actually want to log every day.",
    avatar: "ML",
  },
  {
    name: "Sofia K.",
    quote: "Progress charts make it obvious what’s working. Love it.",
    avatar: "SK",
  },
];

export function TestimonialsSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Loved by people who train
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-foreground/70">
          Designed to feel motivating, not overwhelming.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {testimonials.map((t) => (
          <Card key={t.name} className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/70 to-primary text-xs font-semibold text-primary-foreground shadow-sm">
                {t.avatar}
              </div>
              <div>
                <div className="text-sm font-medium">{t.name}</div>
                <div className="text-xs text-foreground/60">FitTrack user</div>
              </div>
            </div>
            <p className="mt-4 text-sm text-foreground/80">“{t.quote}”</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
