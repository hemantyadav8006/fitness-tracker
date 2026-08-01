"use client";

import type { ReactNode } from "react";
import { MotionItem, MotionStagger } from "@/components/motion-reveal";

export function DashboardMotion({
  header,
  stats,
  charts,
}: {
  header: ReactNode;
  stats: ReactNode[];
  charts: ReactNode[];
}) {
  return (
    <div className="space-y-6">
      <MotionStagger>
        <MotionItem>{header}</MotionItem>
      </MotionStagger>

      <MotionStagger className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, i) => (
          <MotionItem key={i}>{stat}</MotionItem>
        ))}
      </MotionStagger>

      <MotionStagger className="grid gap-4 md:grid-cols-2">
        {charts.map((chart, i) => (
          <MotionItem key={i}>{chart}</MotionItem>
        ))}
      </MotionStagger>
    </div>
  );
}
