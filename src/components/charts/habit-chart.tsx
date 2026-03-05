"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";

interface HabitPoint {
  name: string;
  completion: number;
}

export function HabitCompletionChartModern() {
  const [data, setData] = useState<HabitPoint[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/habits/completion");
      const json = (await res.json()) as {
        success: boolean;
        data?: HabitPoint[];
      };
      if (!json.success || !json.data) return;
      setData(json.data);
    }
    void load();
  }, []);

  if (data.length === 0) {
    return (
      <Card className="flex h-64 flex-col items-center justify-center gap-2 p-4">
        <h2 className="text-sm font-semibold">Habit completion</h2>
        <p className="text-xs text-muted-foreground">
          No habit data yet. Log completions to see your trends.
        </p>
      </Card>
    );
  }

  return (
    <Card className="h-64 p-4 sm:p-5">
      <div className="mb-3 space-y-1">
        <h2 className="text-sm font-semibold">Habit completion</h2>
        <p className="text-xs text-muted-foreground">
          Percentage of days completed per habit.
        </p>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11 }}
            tickLine={false}
            tickMargin={8}
          />
          <YAxis
            tickFormatter={(v?: number) => `${v ?? 0}%`}
            tick={{ fontSize: 11 }}
            tickLine={false}
            tickMargin={8}
            domain={[0, 100]}
          />
          <Tooltip
            formatter={(v?: number) => `${((v ?? 0) as number).toFixed(0)}%`}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid rgba(148, 163, 184, 0.6)",
              fontSize: 12,
            }}
          />
          <Bar
            dataKey="completion"
            radius={8}
            fill="url(#habitBarGradient)"
            barSize={22}
          />
          <defs>
            <linearGradient id="habitBarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity={0.95} />
              <stop offset="100%" stopColor="#22c55e" stopOpacity={0.6} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

