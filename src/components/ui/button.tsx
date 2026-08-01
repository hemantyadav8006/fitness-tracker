"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import { motionTransition, pickTransition } from "@/lib/motion";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
}

function getButtonClasses(variant: ButtonVariant, size: ButtonSize): string {
  const base =
    "inline-flex items-center justify-center rounded-xl text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60 gap-2";

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-primary text-primary-foreground shadow-md hover:bg-primary/90",
    secondary:
      "bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80",
    ghost: "bg-transparent text-foreground hover:bg-muted border border-transparent",
    danger:
      "bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90",
  };

  const sizes: Record<ButtonSize, string> = {
    sm: "h-8 px-3 text-xs",
    md: "h-9 px-4",
    lg: "h-10 px-5 text-base",
    icon: "h-9 w-9 justify-center p-0",
  };

  return cn(base, variants[variant], sizes[size]);
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  leftIcon,
  rightIcon,
  isLoading,
  children,
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
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
    <motion.button
      type={type}
      className={cn(getButtonClasses(variant, size), className)}
      disabled={disabled || isLoading}
      whileHover={reduced || disabled || isLoading ? undefined : { scale: 1.02 }}
      whileTap={reduced || disabled || isLoading ? undefined : { scale: 0.98 }}
      transition={pickTransition(reduced, motionTransition.fast)}
      {...rest}
    >
      {isLoading && (
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-[2px] border-current/40 border-t-transparent"
        />
      )}
      {leftIcon && !isLoading ? leftIcon : null}
      <span>{children}</span>
      {rightIcon && !isLoading ? rightIcon : null}
    </motion.button>
  );
}
