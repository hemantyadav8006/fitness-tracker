import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Fitness Tracker",
  description: "Minimal fitness tracking dashboard",
  icons: {
    icon: "/favicon.ico"
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}

