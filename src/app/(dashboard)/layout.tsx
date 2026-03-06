import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getUserFromRequest, clearAuthCookie } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { PageTransition } from "@/components/page-transition";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/workouts", label: "Workouts" },
  { href: "/habits", label: "Habits" },
  { href: "/progress", label: "Progress" },
];

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getUserFromRequest();

  if (!user) {
    redirect("/");
  }

  async function handleLogout() {
    "use server";
    await clearAuthCookie();
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-muted/60">
      <Sidebar
        items={navItems}
        username={user.username}
        logoutAction={handleLogout}
      />
      <div className="flex min-h-screen flex-1 flex-col lg:pl-0">
        <Navbar username={user.username} />
        <main className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pb-16 pt-4 sm:px-6 sm:pt-6 lg:pb-8">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
      <MobileNav items={navItems} />
    </div>
  );
}
