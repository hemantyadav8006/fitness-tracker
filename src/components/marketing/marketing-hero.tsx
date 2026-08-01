"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { HeroDashboardMock } from "./mock/hero-dashboard-mock";
import { cn } from "@/lib/cn";
import {
  fadeUp,
  motionTransition,
  pickTransition,
  staggerContainer,
} from "@/lib/motion";

function PrimaryButtonLink({ href, label }: { href: string; label: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      whileHover={reduced ? undefined : { scale: 1.02 }}
      whileTap={reduced ? undefined : { scale: 0.98 }}
      transition={pickTransition(reduced, motionTransition.fast)}
    >
      <Link
        href={href as any}
        className={cn(
          "inline-flex h-10 items-center justify-center rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground shadow-md shadow-primary/20",
          "hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        )}
      >
        {label}
      </Link>
    </motion.div>
  );
}

function SecondaryButtonLink({ href, label }: { href: string; label: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      whileHover={reduced ? undefined : { scale: 1.02 }}
      whileTap={reduced ? undefined : { scale: 0.98 }}
      transition={pickTransition(reduced, motionTransition.fast)}
    >
      <Link
        href={href as any}
        className={cn(
          "inline-flex h-10 items-center justify-center rounded-xl border border-border/60 bg-background/50 px-5 text-sm font-medium text-foreground shadow-sm backdrop-blur-md",
          "hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        )}
      >
        {label}
      </Link>
    </motion.div>
  );
}

export function MarketingHero() {
  const reduced = useReducedMotion();

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          transition={pickTransition(reduced)}
        >
          <motion.div
            variants={fadeUp}
            transition={pickTransition(reduced, motionTransition.base)}
            className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/50 px-3 py-1 text-xs font-medium text-foreground/70 shadow-sm backdrop-blur-md"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            Built for consistency, not chaos
          </motion.div>

          <motion.h1
            variants={fadeUp}
            transition={pickTransition(reduced, motionTransition.base)}
            className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-5xl"
          >
            Track Your Fitness.{" "}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Transform Your Life.
            </span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            transition={pickTransition(reduced, motionTransition.base)}
            className="mt-4 max-w-xl text-sm text-foreground/70 sm:text-base"
          >
            Monitor workouts, calories, weight, and progress in one powerful
            dashboard—designed to keep you focused, motivated, and improving.
          </motion.p>

          <motion.div
            variants={fadeUp}
            transition={pickTransition(reduced, motionTransition.base)}
            className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <PrimaryButtonLink href="/register" label="Start Tracking Free" />
            <SecondaryButtonLink href="#preview" label="See Demo" />
          </motion.div>

          <motion.div
            variants={fadeUp}
            transition={pickTransition(reduced, motionTransition.base)}
            className="mt-6 flex flex-wrap items-center gap-3 text-xs text-foreground/60"
          >
            {["Workout logs", "Progress charts", "Habit streaks"].map((t) => (
              <div
                key={t}
                className="rounded-full border border-border/50 bg-background/50 px-3 py-1 shadow-sm backdrop-blur-md"
              >
                {t}
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="relative"
          initial={reduced ? false : { opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={pickTransition(reduced, {
            ...motionTransition.slow,
            delay: 0.1,
          })}
        >
          <HeroDashboardMock />
        </motion.div>
      </div>
    </section>
  );
}
