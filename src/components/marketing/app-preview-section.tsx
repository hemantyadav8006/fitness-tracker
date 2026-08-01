"use client";

import { AppPreviewMock } from "./mock/app-preview-mock";
import { MotionReveal } from "@/components/motion-reveal";

export function AppPreviewSection() {
  return (
    <section id="preview" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <MotionReveal className="mb-8">
        <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          A dashboard that feels premium
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-foreground/70">
          Clean glassmorphism, readable charts, and the metrics you care about
          most—always within reach.
        </p>
      </MotionReveal>

      <MotionReveal delay={0.08}>
        <AppPreviewMock />
      </MotionReveal>
    </section>
  );
}
