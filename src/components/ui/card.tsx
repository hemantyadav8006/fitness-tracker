"use client";

import type { HTMLAttributes } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import { motionTransition, pickTransition } from "@/lib/motion";

export function Card({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const reduced = useReducedMotion();
  const {
    onDrag,
    onDragStart,
    onDragEnd,
    onAnimationStart,
    onAnimationEnd,
    ...rest
  } = props;

  return (
    <motion.div
      className={cn(
        "rounded-2xl border border-border/50 bg-card/70 shadow-sm backdrop-blur-md",
        className,
      )}
      whileHover={reduced ? undefined : { y: -2, transition: motionTransition.fast }}
      transition={pickTransition(reduced, motionTransition.fast)}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
