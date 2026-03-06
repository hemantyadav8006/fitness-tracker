"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";

interface WorkoutPoint {
  label: string;
  count: number;
}

export function WorkoutFrequencyChart() {
  const [data, setData] = useState<WorkoutPoint[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/workouts/frequency");
      const json = (await res.json()) as {
        success: boolean;
        data?: { date: string; workouts: number }[];
      };
      if (!json.success || !json.data) return;
      const mapped: WorkoutPoint[] = json.data.map((d) => ({
        label: new Date(d.date).toLocaleDateString(),
        count: d.workouts,
      }));
      setData(mapped);
    }
    void load();
  }, []);

  if (data.length === 0) {
    return (
      <Card className="flex h-64 flex-col items-center justify-center gap-2 p-4">
        <h2 className="text-sm font-semibold">Workout frequency</h2>
        <p className="text-xs text-muted-foreground">
          No workouts logged yet. Log a session to see this chart.
        </p>
      </Card>
    );
  }

  return (
    <Card className="h-64 p-4 sm:p-5">
      <div className="mb-3 space-y-1">
        <h2 className="text-sm font-semibold">Workout frequency</h2>
        <p className="text-xs text-muted-foreground">
          How often you&apos;ve trained recently.
        </p>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e4e4e7"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tickLine={false}
            tickMargin={8}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            tickMargin={8}
            tick={{ fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid rgba(148, 163, 184, 0.6)",
              fontSize: 12,
            }}
          />
          <Bar
            dataKey="count"
            radius={6}
            fill="url(#workoutBarGradient)"
            barSize={24}
          />
          <defs>
            <linearGradient id="workoutBarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.5} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
