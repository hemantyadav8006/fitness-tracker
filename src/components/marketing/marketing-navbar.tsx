import Link from "next/link";
import type { UserSafe } from "@/types/domain";
import { cn } from "@/lib/cn";

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href as any}
      className={cn(
        "rounded-full px-3 py-2 text-sm font-medium text-foreground/70 transition-all duration-200",
        "hover:bg-muted hover:text-foreground",
      )}
    >
      {label}
    </Link>
  );
}

function PrimaryLinkButton({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href as any}
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm",
        "transition-all duration-200 hover:shadow-md hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
      )}
    >
      {label}
    </Link>
  );
}

function SecondaryLinkButton({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href as any}
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-full border border-border/70 bg-background/70 px-4 text-sm font-medium text-foreground shadow-sm backdrop-blur",
        "transition-all duration-200 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
      )}
    >
      {label}
    </Link>
  );
}

export function MarketingNavbar({ user }: { user: UserSafe | null }) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="h-9 w-9 rounded-2xl bg-gradient-to-br from-primary/80 to-primary shadow-sm" />
          <span className="text-sm font-semibold tracking-tight">FitTrack</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          <NavLink href="#features" label="Features" />
          <NavLink href="#how" label="How It Works" />
          <NavLink href="#pricing" label="Pricing" />
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <SecondaryLinkButton href="/dashboard" label="Dashboard" />
              <PrimaryLinkButton href="/workouts" label="Log Workout" />
            </>
          ) : (
            <>
              <SecondaryLinkButton href="/login" label="Login" />
              <PrimaryLinkButton href="/register" label="Get Started" />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
