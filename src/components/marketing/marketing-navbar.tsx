"use client";

import Link from "next/link";
import type { UserSafe } from "@/types/domain";
import { cn } from "@/lib/cn";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/brand/logo";
import { motion, useReducedMotion } from "framer-motion";
import { motionTransition, pickTransition } from "@/lib/motion";

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href as any}
      className={cn(
        "rounded-xl px-3 py-2 text-sm font-medium text-foreground/70 transition-colors duration-200",
        "hover:bg-muted/70 hover:text-foreground",
      )}
    >
      {label}
    </Link>
  );
}

function MotionLink({
  href,
  label,
  variant,
}: {
  href: string;
  label: string;
  variant: "primary" | "secondary";
}) {
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
          "inline-flex h-9 items-center justify-center rounded-xl px-4 text-sm font-medium shadow-sm",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          variant === "primary"
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "border border-border/60 bg-background/40 text-foreground backdrop-blur-md hover:bg-muted/70",
        )}
      >
        {label}
      </Link>
    </motion.div>
  );
}

export function MarketingNavbar({ user }: { user: UserSafe | null }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-white/10 dark:border-white/5",
        "bg-background/40 backdrop-blur-xl backdrop-saturate-150",
        "supports-[backdrop-filter]:bg-background/30",
      )}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Logo markClassName="h-9 w-9" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          <NavLink href="#features" label="Features" />
          <NavLink href="#how" label="How It Works" />
          <NavLink href="#pricing" label="Pricing" />
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <>
              <MotionLink
                href="/dashboard"
                label="Dashboard"
                variant="secondary"
              />
              <MotionLink
                href="/workouts"
                label="Log Workout"
                variant="primary"
              />
            </>
          ) : (
            <>
              <MotionLink href="/login" label="Login" variant="secondary" />
              <MotionLink
                href="/register"
                label="Get Started"
                variant="primary"
              />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
