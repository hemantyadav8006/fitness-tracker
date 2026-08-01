"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import {
  LayoutDashboard,
  Dumbbell,
  Flame,
  LineChart,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { motionTransition, pickTransition } from "@/lib/motion";

interface MobileNavItem {
  href: string;
  label: string;
}

interface MobileNavProps {
  items: MobileNavItem[];
}

const icons: Record<string, React.ReactNode> = {
  "/dashboard": <LayoutDashboard className="h-4 w-4" />,
  "/workouts": <Dumbbell className="h-4 w-4" />,
  "/habits": <Flame className="h-4 w-4" />,
  "/progress": <LineChart className="h-4 w-4" />,
};

export function MobileNav({ items }: MobileNavProps) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  return (
    <nav
      aria-label="Bottom navigation"
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 flex h-14 items-center justify-around px-2 pb-2 pt-1.5 lg:hidden",
        "border-t border-white/10 dark:border-white/5",
        "bg-background/50 backdrop-blur-xl backdrop-saturate-150",
        "supports-[backdrop-filter]:bg-background/35",
      )}
    >
      {items.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href as any}
            className={cn(
              "relative flex flex-1 flex-col items-center justify-center gap-0.5 rounded-xl py-1 text-[11px] font-medium text-muted-foreground",
              active && "text-foreground",
            )}
          >
            {active && (
              <motion.span
                layoutId={reduced ? undefined : "mobile-nav-active"}
                className="absolute inset-0 rounded-xl bg-muted/70"
                transition={pickTransition(reduced, motionTransition.base)}
              />
            )}
            <span className="relative z-10 mb-0.5 text-primary">
              {icons[item.href]}
            </span>
            <span className="relative z-10">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
