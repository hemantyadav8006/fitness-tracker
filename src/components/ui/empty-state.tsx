import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Card } from "./card";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <Card
      className={cn(
        "flex flex-col items-center justify-center gap-2 px-4 py-8 text-center",
        className,
      )}
    >
      {icon ? (
        <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
          {icon}
        </div>
      ) : null}
      <div className="text-sm font-medium">{title}</div>
      <p className="max-w-xs text-xs text-muted-foreground">{description}</p>
    </Card>
  );
}

