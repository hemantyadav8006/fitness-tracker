import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getUserFromRequest, clearAuthCookie } from "@/lib/auth";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/workouts", label: "Workouts" },
  { href: "/dashboard/habits", label: "Habits" },
  { href: "/dashboard/progress", label: "Progress" }
];

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await getUserFromRequest();

  if (!user) {
    redirect("/login");
  }

  async function handleLogout() {
    "use server";
    clearAuthCookie();
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-muted">
      <aside className="flex w-60 flex-col border-r border-border bg-white/80 p-4 dark:bg-neutral-950/80">
        <div className="mb-6">
          <div className="text-lg font-semibold">Fitness Tracker</div>
          <div className="text-xs text-gray-500">Logged in as {user.username}</div>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-muted dark:text-gray-200"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={handleLogout} className="mt-auto">
          <button
            type="submit"
            className="mt-4 w-full rounded-md border border-border px-3 py-2 text-sm text-gray-700 hover:bg-muted dark:text-gray-200"
          >
            Logout
          </button>
        </form>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

