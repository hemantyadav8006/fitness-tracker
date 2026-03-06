import type { ReactNode } from "react";

interface NavbarProps {
  username: string;
  rightSlot?: ReactNode;
}

export function Navbar({ username, rightSlot }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-border/60 bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <div className="flex flex-1 flex-col justify-center">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Dashboard
        </span>
        <span className="text-sm font-semibold">{username}</span>
      </div>
      <div className="flex items-center gap-2">
        {rightSlot}
        <details className="relative">
          <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full border border-border/70 bg-muted/60 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted">
            <span className="h-6 w-6 rounded-full bg-gradient-to-br from-primary/60 to-primary/90" />
            <span className="hidden sm:inline">{username}</span>
            <span aria-hidden="true" className="text-[10px]">
              ▾
            </span>
          </summary>
          <div className="absolute right-0 mt-2 w-40 rounded-xl border border-border/60 bg-background/95 p-1.5 text-xs shadow-lg">
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
