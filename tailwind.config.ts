import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/hooks/**/*.{ts,tsx}",
    "./src/utils/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(210 20% 98%)",
        foreground: "hsl(222 47% 11%)",
        muted: "hsl(210 20% 96%)",
        primary: {
          DEFAULT: "hsl(222 84% 56%)",
          foreground: "hsl(0 0% 100%)",
        },
        border: "hsl(214 32% 91%)",
      },
    },
  },
  plugins: [],
};

export default config;
