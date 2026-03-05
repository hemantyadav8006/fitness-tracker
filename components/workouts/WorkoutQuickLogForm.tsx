"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function WorkoutQuickLogForm() {
  const router = useRouter();
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [exerciseName, setExerciseName] = useState("");
  const [reps, setReps] = useState<string>("10");
  const [weight, setWeight] = useState<string>("50");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/workouts/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          exercises: [
            {
              name: exerciseName,
              sets: [
                {
                  reps: Number(reps),
                  weight: Number(weight),
                  notes: notes || undefined
                }
              ]
            }
          ]
        })
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error?.message ?? "Failed to log workout");
        return;
      }
      router.refresh();
      setNotes("");
    } catch (err) {
      console.error(err);
      setError("Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid gap-3 md:grid-cols-4">
        <div>
          <label className="mb-1 block text-xs font-medium">Date</label>
          <input
            type="date"
            className="input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">Exercise</label>
          <input
            className="input"
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">Reps</label>
          <input
            type="number"
            className="input"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">Weight</label>
          <input
            type="number"
            className="input"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium">Notes (optional)</label>
        <input
          className="input"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button type="submit" className="btn-primary text-xs" disabled={loading}>
        {loading ? "Saving..." : "Quick log"}
      </button>
    </form>
  );
}

