"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface ChartPoint {
  name: string;
  completion: number;
}

export function HabitCompletionChart() {
  const [data, setData] = useState<ChartPoint[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/habits/completion");
      const json = (await res.json()) as { success: boolean; data?: ChartPoint[] };
      if (!json.success || !json.data) return;
      setData(json.data);
    }
    void load();
  }, []);

  if (data.length === 0) {
    return <p className="text-sm text-gray-500">No habit data yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data}>
        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
        <YAxis tickFormatter={(v?: number) => `${v ?? 0}%`} tick={{ fontSize: 10 }} />
        <Tooltip
          formatter={(v?: number) => `${((v ?? 0) as number).toFixed(0)}%`}
        />
        <Bar dataKey="completion" fill="#22c55e" />
      </BarChart>
    </ResponsiveContainer>
  );
}

