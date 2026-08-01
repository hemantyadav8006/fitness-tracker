"use client";

import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/cn";

interface NavbarProps {
  username: string;
  rightSlot?: ReactNode;
}

export function Navbar({ username, rightSlot }: NavbarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-14 items-center justify-between gap-4 px-4 sm:px-6",
        "border-b border-white/10 dark:border-white/5",
        "bg-background/45 backdrop-blur-xl backdrop-saturate-150",
        "supports-[backdrop-filter]:bg-background/35",
        "shadow-[0_1px_0_0_hsl(var(--border)/0.4)]",
      )}
    >
      <div className="flex flex-1 flex-col justify-center">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Dashboard
        </span>
        <span className="font-display text-sm font-semibold">{username}</span>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        {rightSlot}
        <details className="relative">
          <summary
            className={cn(
              "flex cursor-pointer list-none items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground",
              "border border-border/50 bg-background/40 backdrop-blur-md hover:bg-muted/60",
            )}
          >
            <span className="h-6 w-6 rounded-full bg-gradient-to-br from-primary/60 to-primary/90" />
            <span className="hidden sm:inline">{username}</span>
            <span aria-hidden="true" className="text-[10px]">
              ▾
            </span>
          </summary>
          <div className="absolute right-0 mt-2 w-40 rounded-xl border border-border/50 bg-card/90 p-1.5 text-xs shadow-lg backdrop-blur-xl">
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-muted-foreground hover:bg-muted"
            >
              Profile
            </button>
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-muted-foreground hover:bg-muted"
            >
              Settings
            </button>
          </div>
        </details>
      </div>
    </header>
  );
}
