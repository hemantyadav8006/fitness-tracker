import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Card } from "./card";

interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: ReactNode;
  description?: string;
  icon?: ReactNode;
}

export function StatCard({
  label,
  value,
  description,
  icon,
  className,
  ...props
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "flex flex-col gap-2 p-4 sm:p-5",
        "transition-transform duration-200 hover:-translate-y-0.5",
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </div>
        {icon ? (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
            {icon}
          </div>
        ) : null}
      </div>
      <div className="text-2xl font-semibold">{value}</div>
      {description ? (
        <div className="text-xs text-muted-foreground">{description}</div>
      ) : null}
    </Card>
  );
}
