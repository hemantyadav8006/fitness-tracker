"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function WorkoutTemplateForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [exercises, setExercises] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const exerciseNames = exercises
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch("/api/workouts/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          exercises: exerciseNames.map((n) => ({ name: n }))
        })
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error?.message ?? "Failed to create template");
        return;
      }

      setName("");
      setExercises("");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="mb-1 block text-xs font-medium">Template name</label>
        <input
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium">Exercises (comma-separated)</label>
        <input
          className="input"
          value={exercises}
          onChange={(e) => setExercises(e.target.value)}
          placeholder="Bench Press, Squat, Deadlift"
          required
        />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button type="submit" className="btn-primary text-xs" disabled={loading}>
        {loading ? "Creating..." : "Create template"}
      </button>
    </form>
  );
}

