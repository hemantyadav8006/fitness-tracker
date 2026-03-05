"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

interface MobileNavItem {
  href: string;
  label: string;
}

interface MobileNavProps {
  items: MobileNavItem[];
}

export function MobileNav({ items }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Bottom navigation"
      className="fixed inset-x-0 bottom-0 z-40 flex h-14 items-center justify-around border-t border-border/60 bg-background/95 px-2 pb-2 pt-1.5 backdrop-blur-md lg:hidden"
    >
      {items.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href as any}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-0.5 rounded-full text-[11px] font-medium text-muted-foreground",
              "transition-all duration-150",
              active && "bg-muted text-foreground",
            )}
          >
            <span
              className={cn(
                "mb-0.5 h-1 w-6 rounded-full bg-transparent",
                active && "bg-primary/80",
              )}
            />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
