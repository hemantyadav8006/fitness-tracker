"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import {
  LayoutDashboard,
  Dumbbell,
  Flame,
  LineChart,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { motionTransition, pickTransition } from "@/lib/motion";
import { LogoMark } from "@/components/brand/logo";

interface SidebarItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
}

interface SidebarProps {
  items: SidebarItem[];
  username: string;
  logoutAction: () => void;
}

const defaultIcons: Record<string, React.ReactNode> = {
  "/dashboard": <LayoutDashboard className="h-4 w-4" />,
  "/workouts": <Dumbbell className="h-4 w-4" />,
  "/habits": <Flame className="h-4 w-4" />,
  "/progress": <LineChart className="h-4 w-4" />,
};

export function Sidebar({ items, username, logoutAction }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const reduced = useReducedMotion();

  return (
    <aside
      className={cn(
        "hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col",
        "border-r border-white/10 dark:border-white/5",
        "bg-background/40 backdrop-blur-xl backdrop-saturate-150",
        "supports-[backdrop-filter]:bg-background/30",
        "transition-[width] duration-200",
        collapsed ? "w-20" : "w-64",
      )}
      aria-label="Primary"
    >
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2 overflow-hidden">
          <LogoMark className="h-8 w-8 shrink-0" />
          {!collapsed && (
            <div className="min-w-0">
              <div className="font-display text-sm font-semibold leading-tight">
                FitTrack
              </div>
              <div className="truncate text-[11px] text-muted-foreground">
                Signed in as {username}
              </div>
            </div>
          )}
        </div>
        <button
          type="button"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-border/50 text-muted-foreground transition-colors hover:bg-muted/70"
          onClick={() => setCollapsed((v) => !v)}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </button>
      </div>
      <nav className="relative flex-1 space-y-1 px-2 py-2">
        {items.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href as any}
              className={cn(
                "relative group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground",
                "transition-colors duration-150 hover:text-foreground",
                active && "text-foreground",
              )}
              aria-current={active ? "page" : undefined}
            >
              {active && (
                <motion.span
                  layoutId={reduced ? undefined : "sidebar-active"}
                  className="absolute inset-0 rounded-xl border border-border/50 bg-muted/70 shadow-sm"
                  transition={pickTransition(reduced, motionTransition.base)}
                />
              )}
              <span
                className={cn(
                  "relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-muted/80 text-[13px]",
                  active && "bg-primary/15 text-primary",
                )}
              >
                {item.icon ?? defaultIcons[item.href] ?? item.label[0]}
              </span>
              {!collapsed && (
                <span className="relative z-10">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>
      <form
        action={logoutAction}
        className="border-t border-border/40 px-3 py-4"
      >
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-xl border border-border/50 px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-destructive/40 hover:bg-destructive hover:text-destructive-foreground"
        >
          Logout
        </button>
      </form>
    </aside>
  );
}
