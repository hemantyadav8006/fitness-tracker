/**
 * Resolve CSS custom properties for Recharts (needs concrete color strings).
 * Tokens live as HSL channels in globals.css: --chart-1 … --chart-5.
 */
export function cssVar(name: string, alpha?: number): string {
  if (typeof window === "undefined") {
    return alpha !== undefined ? `hsl(var(${name}) / ${alpha})` : `hsl(var(${name}))`;
  }
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  if (!raw) {
    return alpha !== undefined ? `hsl(var(${name}) / ${alpha})` : `hsl(var(${name}))`;
  }
  return alpha !== undefined ? `hsl(${raw} / ${alpha})` : `hsl(${raw})`;
}

export function chartColors() {
  return {
    primary: cssVar("--chart-1"),
    success: cssVar("--chart-2"),
    info: cssVar("--chart-3"),
    warning: cssVar("--chart-4"),
    accent: cssVar("--chart-5"),
    muted: cssVar("--muted-foreground", 0.45),
    grid: cssVar("--border", 0.7),
    foreground: cssVar("--foreground", 0.7),
  };
}

/** SSR-safe fallbacks matching :root / .dark lime palette (dark-first). */
export const chartColorFallbacks = {
  primary: "hsl(84 85% 52%)",
  success: "hsl(152 58% 48%)",
  info: "hsl(199 80% 55%)",
  warning: "hsl(38 92% 55%)",
  accent: "hsl(280 50% 62%)",
  muted: "hsl(220 10% 62% / 0.45)",
  grid: "hsl(220 12% 18% / 0.7)",
  foreground: "hsl(40 20% 96% / 0.7)",
} as const;
