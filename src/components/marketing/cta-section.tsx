"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import { MotionReveal } from "@/components/motion-reveal";
import { motionTransition, pickTransition } from "@/lib/motion";

export function CtaSection() {
  const reduced = useReducedMotion();

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6">
      <MotionReveal>
        <div
          className={cn(
            "rounded-2xl border border-border/50 p-8 shadow-sm backdrop-blur-md",
            "bg-gradient-to-br from-primary/15 via-background/80 to-background/80",
          )}
        >
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                Start Your Fitness Journey Today
              </h2>
              <p className="mt-2 max-w-xl text-sm text-foreground/70">
                Build momentum with a dashboard designed for focus, not
                friction.
              </p>
            </div>
            <motion.div
              whileHover={reduced ? undefined : { scale: 1.02 }}
              whileTap={reduced ? undefined : { scale: 0.98 }}
              transition={pickTransition(reduced, motionTransition.fast)}
            >
              <Link
                href={"/register" as any}
                className={cn(
                  "inline-flex h-10 items-center justify-center rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground shadow-md shadow-primary/20",
                  "hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                )}
              >
                Create Free Account
              </Link>
            </motion.div>
          </div>
        </div>
      </MotionReveal>
    </section>
  );
}
