"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";

interface Point {
  date: string;
  value: number | null;
}

export function WeightChart() {
  const [data, setData] = useState<Point[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/progress/weight");
      const json = (await res.json()) as {
        success: boolean;
        data?: { date: string; weight: number | null }[];
      };
      if (!json.success || !json.data) return;
      const mapped: Point[] = json.data.map((e) => ({
        date: new Date(e.date).toLocaleDateString(),
        value: e.weight,
      }));
      setData(mapped);
    }
    void load();
  }, []);

  if (data.length === 0) {
    return (
      <Card className="flex h-64 flex-col items-center justify-center gap-2 p-4">
        <h2 className="text-sm font-semibold">Weight trend</h2>
        <p className="text-xs text-muted-foreground">
          No weight data yet. Add your first progress entry.
        </p>
      </Card>
    );
  }

  return (
    <Card className="h-64 p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="space-y-1">
          <h2 className="text-sm font-semibold">Weight trend</h2>
          <p className="text-xs text-muted-foreground">
            Track your weight over time.
          </p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
          <XAxis dataKey="date" tickLine={false} tickMargin={8} />
          <YAxis
            tickLine={false}
            tickMargin={8}
            tick={{ fontSize: 11 }}
            width={40}
          />
          <Tooltip
            cursor={{ stroke: "#a855f7", strokeWidth: 1, strokeDasharray: 4 }}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid rgba(148, 163, 184, 0.6)",
              fontSize: 12,
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#a855f7"
            fill="url(#weightGradient)"
            strokeWidth={2}
          />
          <defs>
            <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a855f7" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#a855f7" stopOpacity={0.02} />
            </linearGradient>
          </defs>
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function WaistChart() {
  const [data, setData] = useState<Point[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/progress/waist");
      const json = (await res.json()) as {
        success: boolean;
        data?: { date: string; waist: number | null }[];
      };
      if (!json.success || !json.data) return;
      const mapped: Point[] = json.data.map((e) => ({
        date: new Date(e.date).toLocaleDateString(),
        value: e.waist,
      }));
      setData(mapped);
    }
    void load();
  }, []);

  if (data.length === 0) {
    return (
      <Card className="flex h-64 flex-col items-center justify-center gap-2 p-4">
        <h2 className="text-sm font-semibold">Waist progress</h2>
        <p className="text-xs text-muted-foreground">
          No waist data yet. Add your first progress entry.
        </p>
      </Card>
    );
  }

  return (
    <Card className="h-64 p-4 sm:p-5">
      <div className="mb-3 space-y-1">
        <h2 className="text-sm font-semibold">Waist progress</h2>
        <p className="text-xs text-muted-foreground">
          Visualize changes in waist circumference.
        </p>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
          <XAxis dataKey="date" tickLine={false} tickMargin={8} />
          <YAxis
            tickLine={false}
            tickMargin={8}
            tick={{ fontSize: 11 }}
            width={40}
          />
          <Tooltip
            cursor={{ stroke: "#22c55e", strokeWidth: 1, strokeDasharray: 4 }}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid rgba(148, 163, 184, 0.6)",
              fontSize: 12,
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#22c55e"
            fill="url(#waistGradient)"
            strokeWidth={2}
          />
          <defs>
            <linearGradient id="waistGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#22c55e" stopOpacity={0.02} />
            </linearGradient>
          </defs>
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
