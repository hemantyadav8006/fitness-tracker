"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { HabitDTO } from "@/types/domain";

interface Props {
  habits: HabitDTO[];
}

export function HabitTodayForm({ habits }: Props) {
  const router = useRouter();
  const [habitId, setHabitId] = useState<string>(habits[0]?._id ?? "");
  const [completed, setCompleted] = useState<boolean>(true);
  const [value, setValue] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const today = new Date().toISOString().slice(0, 10);
      const res = await fetch("/api/habits/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          habitId,
          date: today,
          value: value ? Number(value) : null,
          completed
        })
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error?.message ?? "Failed to save entry");
        return;
      }
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  if (habits.length === 0) {
    return <p className="text-sm text-gray-500">Create a habit first to track today.</p>;
  }

  const selectedHabit = habits.find((h) => h._id === habitId);

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid gap-3 md:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-medium">Habit</label>
          <select
            className="input"
            value={habitId}
            onChange={(e) => setHabitId(e.target.value)}
          >
            {habits.map((h) => (
              <option key={h._id} value={h._id}>
                {h.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">Completed</label>
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
          />
        </div>
        {selectedHabit?.targetType === "numeric" && (
          <div>
            <label className="mb-1 block text-xs font-medium">Value</label>
            <input
              type="number"
              className="input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button type="submit" className="btn-primary text-xs" disabled={loading}>
        {loading ? "Saving..." : "Save today"}
      </button>
    </form>
  );
}

