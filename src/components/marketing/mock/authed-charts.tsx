"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  BarChart,
} from "recharts";
import { Card } from "@/components/ui/card";

const weeklyWorkouts = [
  { day: "Mon", workouts: 1 },
  { day: "Tue", workouts: 0 },
  { day: "Wed", workouts: 1 },
  { day: "Thu", workouts: 1 },
  { day: "Fri", workouts: 0 },
  { day: "Sat", workouts: 2 },
  { day: "Sun", workouts: 1 },
];

const weightProgress = [
  { week: "W1", weight: 81.2 },
  { week: "W2", weight: 80.7 },
  { week: "W3", weight: 80.1 },
  { week: "W4", weight: 79.6 },
];

export function AuthedCharts() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="h-64 p-5">
        <div className="mb-3 space-y-1">
          <h2 className="text-sm font-semibold">Weekly workout chart</h2>
          <p className="text-xs text-foreground/60">Dummy data preview</p>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyWorkouts}>
            <CartesianGrid
              vertical={false}
              stroke="#e4e4e7"
              strokeDasharray="3 3"
            />
            <XAxis dataKey="day" tickLine={false} tick={{ fontSize: 11 }} />
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
            <Bar dataKey="workouts" radius={8} fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="h-64 p-5">
        <div className="mb-3 space-y-1">
          <h2 className="text-sm font-semibold">Weight progress</h2>
          <p className="text-xs text-foreground/60">Dummy data preview</p>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={weightProgress}>
            <CartesianGrid
              vertical={false}
              stroke="#e4e4e7"
              strokeDasharray="3 3"
            />
            <XAxis dataKey="week" tickLine={false} tick={{ fontSize: 11 }} />
            <YAxis tickLine={false} tick={{ fontSize: 11 }} width={40} />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid rgba(148, 163, 184, 0.5)",
                fontSize: 12,
              }}
            />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#0ea5e9"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
