"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";

type LogoMarkProps = {
  className?: string;
  title?: string;
};

/** Progress-ring mark — charcoal tile + lime arc (matches 3D / theme). */
export function LogoMark({ className, title = "FitTrack" }: LogoMarkProps) {
  const uid = useId().replace(/:/g, "");
  const bgId = `ft-mark-bg-${uid}`;
  const ringId = `ft-mark-ring-${uid}`;

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-9 w-9 shrink-0", className)}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <defs>
        <linearGradient id={bgId} x1="6" y1="4" x2="28" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#243016" />
          <stop offset="1" stopColor="#12161c" />
        </linearGradient>
        <linearGradient id={ringId} x1="8" y1="6" x2="26" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#84cc16" />
          <stop offset="1" stopColor="#b8ff40" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="10" fill={`url(#${bgId})`} />
      <rect
        x="0.75"
        y="0.75"
        width="30.5"
        height="30.5"
        rx="9.25"
        stroke="#2a3140"
        strokeWidth="1.5"
      />
      <circle
        cx="16"
        cy="16"
        r="9"
        stroke="#2f3a28"
        strokeWidth="2.5"
        fill="none"
      />
      <path
        d="M16 7a9 9 0 1 1-7.794 4.5"
        stroke={`url(#${ringId})`}
        strokeWidth="2.75"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="8.2" cy="11.5" r="2" fill="#b8ff40" />
      <circle cx="16" cy="16" r="3.25" fill="#b8ff40" opacity="0.95" />
      <circle cx="16" cy="16" r="1.35" fill="#0f1408" />
    </svg>
  );
}

type LogoProps = {
  className?: string;
  markClassName?: string;
  showWordmark?: boolean;
  wordmark?: string;
};

export function Logo({
  className,
  markClassName,
  showWordmark = true,
  wordmark = "FitTrack",
}: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark className={markClassName} title={wordmark} />
      {showWordmark ? (
        <span className="font-display text-sm font-semibold tracking-tight text-foreground">
          {wordmark}
        </span>
      ) : null}
    </span>
  );
}
