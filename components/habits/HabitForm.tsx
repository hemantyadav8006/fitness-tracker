"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function HabitForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [targetType, setTargetType] = useState<"boolean" | "numeric">("boolean");
  const [targetValue, setTargetValue] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          targetType,
          targetValue: targetType === "numeric" && targetValue ? Number(targetValue) : null
        })
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error?.message ?? "Failed to create habit");
        return;
      }
      setName("");
      setTargetValue("");
      setTargetType("boolean");
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
        <label className="mb-1 block text-xs font-medium">Name</label>
        <input
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium">Target type</label>
          <select
            className="input"
            value={targetType}
            onChange={(e) => setTargetType(e.target.value as "boolean" | "numeric")}
          >
            <option value="boolean">Boolean (completed / not)</option>
            <option value="numeric">Numeric</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">Target value (optional)</label>
          <input
            className="input"
            type="number"
            value={targetValue}
            onChange={(e) => setTargetValue(e.target.value)}
            disabled={targetType === "boolean"}
          />
        </div>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button type="submit" className="btn-primary text-xs" disabled={loading}>
        {loading ? "Creating..." : "Create habit"}
      </button>
    </form>
  );
}

