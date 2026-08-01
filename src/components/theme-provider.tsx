"use client";

import type { ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Applies theme via class on <html> (document.documentElement).
 * attribute="class" is required so Tailwind dark: variants activate.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      storageKey="fitness-tracker-theme"
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
