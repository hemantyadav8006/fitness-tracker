"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

const ringData = [
  { name: "Consumed", value: 68 },
  { name: "Remaining", value: 32 },
];
const weeklyWorkouts = [
  { day: "M", v: 1 },
  { day: "T", v: 0 },
  { day: "W", v: 1 },
  { day: "T", v: 1 },
  { day: "F", v: 0 },
  { day: "S", v: 2 },
  { day: "S", v: 1 },
];
const weightData = [
  { d: "1", v: 81.2 },
  { d: "2", v: 80.8 },
  { d: "3", v: 80.6 },
  { d: "4", v: 80.1 },
  { d: "5", v: 79.9 },
  { d: "6", v: 79.6 },
];

function GlassCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card
      className={cn(
        "rounded-2xl border border-border/60 bg-background/60 p-5 shadow-sm backdrop-blur",
        "transition-all duration-200 hover:shadow-md",
      )}
    >
      <div className="text-xs font-medium text-foreground/60">{title}</div>
      <div className="mt-3">{children}</div>
    </Card>
  );
}

export function AppPreviewMock() {
  return (
    <div className="relative">
      <div
        className="absolute -inset-8 rounded-[2.5rem] bg-gradient-to-br from-primary/10 via-transparent to-transparent blur-2xl"
        aria-hidden="true"
      />

      <Card className="relative overflow-hidden p-5 sm:p-6">
        <div className="flex flex-col gap-1">
          <div className="text-xs font-medium text-foreground/60">FitTrack</div>
          <div className="text-lg font-semibold tracking-tight">
            Dashboard preview
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <GlassCard title="Calories progress">
              <div className="flex items-center gap-4">
                <div className="h-24 w-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ringData}
                        dataKey="value"
                        innerRadius={32}
                        outerRadius={44}
                        startAngle={90}
                        endAngle={-270}
                        paddingAngle={2}
                      >
                        <Tooltip />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <div className="text-2xl font-semibold">1,830</div>
                  <div className="text-xs text-foreground/60">
                    of 2,700 kcal
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

          <div className="lg:col-span-5">
            <GlassCard title="Weekly workout chart">
              <div className="h-28">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyWorkouts}>
                    <CartesianGrid
                      vertical={false}
                      stroke="#e4e4e7"
                      strokeDasharray="3 3"
                    />
                    <XAxis
                      dataKey="day"
                      tickLine={false}
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis
                      allowDecimals={false}
                      tickLine={false}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid rgba(148, 163, 184, 0.5)",
                        fontSize: 12,
                      }}
                    />
                    <Bar dataKey="v" radius={8} fill="#2563eb" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>

          <div className="lg:col-span-3">
            <GlassCard title="Step counter">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-2xl font-semibold">8,420</div>
                  <div className="text-xs text-foreground/60">steps today</div>
                </div>
                <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  +12%
                </div>
              </div>
            </GlassCard>
          </div>

          <div className="lg:col-span-12">
            <GlassCard title="Weight tracker">
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weightData}>
                    <CartesianGrid
                      vertical={false}
                      stroke="#e4e4e7"
                      strokeDasharray="3 3"
                    />
                    <XAxis
                      dataKey="d"
                      tickLine={false}
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis
                      tickLine={false}
                      tick={{ fontSize: 11 }}
                      width={40}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid rgba(148, 163, 184, 0.5)",
                        fontSize: 12,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="v"
                      stroke="#0ea5e9"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>
        </div>
      </Card>
    </div>
  );
}
