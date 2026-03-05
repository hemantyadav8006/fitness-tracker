import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type BadgeVariant = "default" | "outline" | "positive" | "warning" | "danger";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const base =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium";

  const variants: Record<BadgeVariant, string> = {
    default:
      "border-transparent bg-primary/10 text-primary dark:bg-primary/20",
    outline: "border-border/70 text-muted-foreground",
    positive:
      "border-transparent bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
    warning:
      "border-transparent bg-amber-500/10 text-amber-700 dark:text-amber-300",
    danger:
      "border-transparent bg-red-500/10 text-red-600 dark:text-red-300",
  };

  return (
    <span className={cn(base, variants[variant], className)} {...props} />
  );
}

