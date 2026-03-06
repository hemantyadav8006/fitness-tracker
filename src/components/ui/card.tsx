import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 bg-card/80 shadow-sm backdrop-blur-sm transition-all duration-200 hover:shadow-md",
        "dark:border-border/40 dark:bg-neutral-900/80",
        className,
      )}
      {...props}
    />
  );
}
