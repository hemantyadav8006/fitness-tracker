import type { Transition, Variants } from "framer-motion";

/** Fast, subtle defaults — pair with useReducedMotion() at call sites. */
export const motionTransition = {
  fast: { duration: 0.15, ease: [0.16, 1, 0.3, 1] } satisfies Transition,
  base: { duration: 0.22, ease: [0.16, 1, 0.3, 1] } satisfies Transition,
  slow: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } satisfies Transition,
};

export const reducedMotionTransition = {
  duration: 0.01,
  ease: "linear",
} satisfies Transition;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1 },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

export function pickTransition(
  reduced: boolean | null,
  transition: Transition = motionTransition.base,
): Transition {
  return reduced ? reducedMotionTransition : transition;
}
