"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

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

export function Sidebar({ items, username, logoutAction }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "hidden border-r border-border/60 bg-background/80 backdrop-blur-sm shadow-sm lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col",
        "transition-[width] duration-200",
        collapsed ? "w-20" : "w-64",
      )}
      aria-label="Primary"
    >
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-2xl bg-primary/10" />
          {!collapsed && (
            <div>
              <div className="text-sm font-semibold leading-tight">
                Fitness Tracker
              </div>
              <div className="text-[11px] text-muted-foreground">
                Signed in as {username}
              </div>
            </div>
          )}
        </div>
        <button
          type="button"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/70 text-xs text-muted-foreground hover:bg-muted transition-all duration-200"
          onClick={() => setCollapsed((v) => !v)}
        >
          {collapsed ? "»" : "«"}
        </button>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-2">
        {items.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href as any}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-150",
                "hover:bg-muted hover:text-foreground",
                active &&
                  "bg-muted text-foreground shadow-sm border border-border/60",
              )}
              aria-current={active ? "page" : undefined}
            >
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[13px]",
                  active && "bg-primary/10 text-primary",
                )}
              >
                {item.icon ?? item.label[0]}
              </span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
      <form
        action={logoutAction}
        className="border-t border-border/60 px-3 py-4"
      >
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-lg border border-border/70 px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-red-500 hover:text-white transition-all duration-300"
        >
          Logout
        </button>
      </form>
    </aside>
  );
}
