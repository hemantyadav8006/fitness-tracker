"use client";

import { Card } from "@/components/ui/card";
import { MotionItem, MotionReveal, MotionStagger } from "@/components/motion-reveal";

const steps = [
  {
    title: "Create your account",
    description: "Set up in seconds and personalize your goals.",
    step: "01",
  },
  {
    title: "Log workouts & nutrition",
    description: "Quick entries that don’t interrupt your day.",
    step: "02",
  },
  {
    title: "Track progress and improve",
    description: "See trends and stay motivated week after week.",
    step: "03",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <MotionReveal className="mb-8">
        <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          How it works
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-foreground/70">
          A simple loop: log → learn → improve.
        </p>
      </MotionReveal>

      <MotionStagger className="grid gap-4 md:grid-cols-3">
        {steps.map((s) => (
          <MotionItem key={s.title}>
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 font-display text-sm font-semibold text-primary">
                  {s.step}
                </div>
              </div>
              <h3 className="mt-4 font-display text-lg font-medium">{s.title}</h3>
              <p className="mt-1 text-sm text-foreground/70">{s.description}</p>
            </Card>
          </MotionItem>
        ))}
      </MotionStagger>
    </section>
  );
}
