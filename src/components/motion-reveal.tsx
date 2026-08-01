"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import {
  fadeUp,
  motionTransition,
  pickTransition,
  staggerContainer,
} from "@/lib/motion";
import { cn } from "@/lib/cn";

type RevealProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
  delay?: number;
};

export function MotionReveal({
  children,
  className,
  delay = 0,
  ...props
}: RevealProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      transition={pickTransition(reduced, {
        ...motionTransition.base,
        delay: reduced ? 0 : delay,
      })}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function MotionStagger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      transition={pickTransition(reduced)}
    >
      {children}
    </motion.div>
  );
}

export function MotionItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={fadeUp}
      transition={pickTransition(reduced, motionTransition.base)}
    >
      {children}
    </motion.div>
  );
}
