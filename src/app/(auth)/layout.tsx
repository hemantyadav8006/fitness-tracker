import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="w-full max-w-md rounded-xl border border-border bg-white p-8 shadow-lg dark:bg-neutral-950">
        <h1 className="mb-6 text-center text-2xl font-semibold">Fitness Tracker</h1>
        {children}
      </div>
    </div>
  );
}

