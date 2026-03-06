"use client";

import { useEffect, useState } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ProgressEntryDTO } from "@/types/domain";

interface ChartPoint {
  date: string;
  weight: number;
}

export function WeightProgressChart() {
  const [data, setData] = useState<ChartPoint[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/progress/weight");
      const json = (await res.json()) as {
        success: boolean;
        data?: ProgressEntryDTO[];
      };
      if (!json.success || !json.data) return;
      const mapped: ChartPoint[] = json.data
        .filter((e) => e.weight != null)
        .map((e) => ({
          date: new Date(e.date).toLocaleDateString(),
          weight: e.weight ?? 0,
        }));
      setData(mapped);
    }
    void load();
  }, []);

  if (data.length === 0) {
    return <p className="text-sm text-gray-500">No weight data yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data}>
        <XAxis dataKey="date" tick={{ fontSize: 10 }} />
        <YAxis tick={{ fontSize: 10 }} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="weight"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
