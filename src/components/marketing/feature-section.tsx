"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { MotionItem, MotionReveal, MotionStagger } from "@/components/motion-reveal";
import { Dumbbell, Flame, LineChart, Target } from "lucide-react";

const features = [
  {
    title: "Workout Tracking",
    description: "Log exercises and monitor performance over time.",
    icon: Dumbbell,
  },
  {
    title: "Calorie Counter",
    description: "Track daily calories and nutrition with clarity.",
    icon: Flame,
  },
  {
    title: "Progress Analytics",
    description: "Visual charts that make improvement obvious.",
    icon: LineChart,
  },
  {
    title: "Goal Setting",
    description: "Set daily/weekly fitness goals that stick.",
    icon: Target,
  },
];

export function FeatureSection() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <MotionReveal className="mb-8">
        <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Everything you need to stay consistent
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-foreground/70">
          Minimal inputs, maximum insight—built to feel fast, calm, and
          rewarding.
        </p>
      </MotionReveal>

      <MotionStagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <MotionItem key={f.title}>
              <Card className={cn("group h-full p-5 shadow-sm")}>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="mt-4">
                  <h3 className="font-display text-lg font-medium">{f.title}</h3>
                  <p className="mt-1 text-sm text-foreground/70">
                    {f.description}
                  </p>
                </div>
              </Card>
            </MotionItem>
          );
        })}
      </MotionStagger>
    </section>
  );
}
