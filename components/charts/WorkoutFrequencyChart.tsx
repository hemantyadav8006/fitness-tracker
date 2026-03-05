"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface ChartPoint {
  date: string;
  workouts: number;
}

export function WorkoutFrequencyChart() {
  const [data, setData] = useState<ChartPoint[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/workouts/frequency");
      const json = (await res.json()) as { success: boolean; data?: ChartPoint[] };
      if (!json.success || !json.data) return;
      setData(json.data);
    }
    void load();
  }, []);

  if (data.length === 0) {
    return <p className="text-sm text-gray-500">No workouts logged yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data}>
        <XAxis dataKey="date" tick={{ fontSize: 10 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
        <Tooltip />
        <Bar dataKey="workouts" fill="#6366f1" />
      </BarChart>
    </ResponsiveContainer>
  );
}

