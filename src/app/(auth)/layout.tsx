"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/brand/logo";
import { fadeUp, motionTransition, pickTransition, scaleIn } from "@/lib/motion";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
      <div className="absolute right-4 top-4 z-20">
        <ThemeToggle />
      </div>
      <motion.div
        className="w-full max-w-md rounded-2xl border border-border/50 bg-card/70 p-8 shadow-lg backdrop-blur-xl"
        variants={scaleIn}
        initial="hidden"
        animate="visible"
        transition={pickTransition(reduced, motionTransition.base)}
      >
        <motion.div
          className="mb-6 flex flex-col items-center gap-3"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={pickTransition(reduced, {
            ...motionTransition.base,
            delay: 0.05,
          })}
        >
          <Logo markClassName="h-11 w-11" />
        </motion.div>
        {children}
      </motion.div>
    </div>
  );
}
