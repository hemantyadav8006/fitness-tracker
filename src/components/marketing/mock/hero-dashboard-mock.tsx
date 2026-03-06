"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

const workoutData = [
  { day: "Mon", v: 20 },
  { day: "Tue", v: 35 },
  { day: "Wed", v: 28 },
  { day: "Thu", v: 55 },
  { day: "Fri", v: 42 },
  { day: "Sat", v: 65 },
  { day: "Sun", v: 48 },
];

function MiniStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background/60 p-4 shadow-sm backdrop-blur">
      <div className="text-xs font-medium text-foreground/60">{label}</div>
      <div className="mt-2 flex items-baseline gap-2">
        <div className="text-xl font-semibold tracking-tight">{value}</div>
        <span
          className={cn("h-2 w-2 rounded-full", accent)}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

export function HeroDashboardMock() {
  return (
    <div className="relative">
      <div
        className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-primary/10 via-transparent to-transparent blur-2xl"
        aria-hidden="true"
      />

      <Card className="relative overflow-hidden p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-medium text-foreground/60">
              Dashboard preview
            </div>
            <div className="mt-1 text-sm font-semibold">Today</div>
          </div>
          <div className="rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs text-foreground/70 shadow-sm backdrop-blur">
            Live metrics
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <MiniStat label="Steps" value="8,420" accent="bg-primary" />
          <MiniStat label="Calories" value="1,830" accent="bg-amber-500" />
          <MiniStat label="Water" value="1.6 L" accent="bg-sky-500" />
          <div className="rounded-2xl border border-border/60 bg-background/60 p-4 shadow-sm backdrop-blur">
            <div className="text-xs font-medium text-foreground/60">
              Workout chart
            </div>
            <div className="mt-2 h-24">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={workoutData}>
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid rgba(148, 163, 184, 0.5)",
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke="#2563eb"
                    strokeWidth={2}
                    fill="url(#heroGrad)"
                  />
                  <defs>
                    <linearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="#2563eb"
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="100%"
                        stopColor="#2563eb"
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
