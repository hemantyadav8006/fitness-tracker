"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { HabitDTO } from "@/types/domain";
import {
  habitEntrySchema,
  workoutLogSchema,
} from "@/lib/validation";
import type { z } from "zod";
import { Badge } from "@/components/ui/badge";

type WorkoutDraft = z.infer<typeof workoutLogSchema>;
type HabitDraft = z.infer<typeof habitEntrySchema>;

type ParseSuccess =
  | {
      type: "workout";
      draft: WorkoutDraft;
      confidence?: string;
    }
  | {
      type: "habit";
      draft: HabitDraft;
      confidence?: string;
      matchedHabitName?: string;
    };

interface Props {
  /** Hint for placeholder copy; parsing still accepts either type. */
  context: "workouts" | "habits";
  habits?: HabitDTO[];
}

function toDateInputValue(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
  const d = new Date(value);
  if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return new Date().toISOString().slice(0, 10);
}

/**
 * Natural-language quick log: parse → editable draft → confirm via existing APIs.
 * Never auto-commits AI output to the database.
 */
export function NlQuickLog({ context, habits = [] }: Props) {
  const router = useRouter();
  const [utterance, setUtterance] = useState("");
  const [parsing, setParsing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsed, setParsed] = useState<ParseSuccess | null>(null);

  // Editable draft fields (workout)
  const [wDate, setWDate] = useState("");
  const [wExercise, setWExercise] = useState("");
  const [wReps, setWReps] = useState("10");
  const [wWeight, setWWeight] = useState("50");
  const [wNotes, setWNotes] = useState("");

  // Editable draft fields (habit)
  const [hHabitId, setHHabitId] = useState("");
  const [hDate, setHDate] = useState("");
  const [hCompleted, setHCompleted] = useState(true);
  const [hValue, setHValue] = useState("");

  const placeholder =
    context === "workouts"
      ? 'e.g. "bench press 3 sets of 5 at 80kg"'
      : 'e.g. "done water" or "meditated 20 minutes"';

  const selectedHabit = useMemo(
    () => habits.find((h) => h._id === hHabitId),
    [habits, hHabitId],
  );

  function applyDraft(result: ParseSuccess) {
    setParsed(result);
    if (result.type === "workout") {
      const first = result.draft.exercises[0];
      const firstSet = first?.sets[0];
      setWDate(toDateInputValue(result.draft.date));
      setWExercise(first?.name ?? "");
      setWReps(String(firstSet?.reps ?? 10));
      setWWeight(String(firstSet?.weight ?? 0));
      setWNotes(firstSet?.notes ?? "");
    } else {
      setHHabitId(result.draft.habitId);
      setHDate(toDateInputValue(result.draft.date));
      setHCompleted(result.draft.completed);
      setHValue(
        result.draft.value != null && result.draft.value !== undefined
          ? String(result.draft.value)
          : "",
      );
    }
  }

  function clearDraft() {
    setParsed(null);
    setError(null);
  }

  async function handleParse(e: React.FormEvent) {
    e.preventDefault();
    setParsing(true);
    setError(null);
    setParsed(null);

    try {
      const res = await fetch("/api/ai/parse-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ utterance }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(
          json.error?.message ??
            "Couldn't understand that. Use the manual form below.",
        );
        return;
      }
      applyDraft(json.data as ParseSuccess);
    } catch {
      setError("Unexpected error parsing that. Try the manual form below.");
    } finally {
      setParsing(false);
    }
  }

  async function handleConfirm() {
    if (!parsed) return;
    setConfirming(true);
    setError(null);

    try {
      if (parsed.type === "workout") {
        const body: WorkoutDraft = {
          date: wDate,
          exercises: [
            {
              name: wExercise,
              sets: [
                {
                  reps: Number(wReps),
                  weight: Number(wWeight),
                  notes: wNotes || undefined,
                },
              ],
            },
          ],
        };
        const res = await fetch("/api/workouts/logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const json = await res.json();
        if (!res.ok || !json.success) {
          setError(json.error?.message ?? "Failed to save workout");
          return;
        }
      } else {
        const body: HabitDraft = {
          habitId: hHabitId,
          date: hDate,
          completed: hCompleted,
          value: hValue ? Number(hValue) : null,
        };
        const res = await fetch("/api/habits/entries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const json = await res.json();
        if (!res.ok || !json.success) {
          setError(json.error?.message ?? "Failed to save habit entry");
          return;
        }
      }

      setUtterance("");
      clearDraft();
      router.refresh();
    } catch {
      setError("Unexpected error saving. Try again.");
    } finally {
      setConfirming(false);
    }
  }

  return (
    <div className="space-y-3">
      <form onSubmit={handleParse} className="space-y-3">
        <div>
          <label className="mb-1 block text-xs font-medium">
            Say it in plain English
          </label>
          <input
            className="input"
            value={utterance}
            onChange={(e) => setUtterance(e.target.value)}
            placeholder={placeholder}
            maxLength={500}
            required
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="submit"
            className="btn-primary text-xs"
            disabled={parsing || !utterance.trim()}
          >
            {parsing ? "Parsing…" : "Parse with AI"}
          </button>
          {parsed ? (
            <Badge variant="outline">
              Draft · {parsed.type}
              {parsed.confidence ? ` · ${parsed.confidence}` : ""}
            </Badge>
          ) : null}
        </div>
      </form>

      {error ? <p className="text-xs text-red-600">{error}</p> : null}

      {parsed?.type === "workout" ? (
        <div className="space-y-3 rounded-xl border border-border/60 bg-background/40 p-3">
          <p className="text-xs text-muted-foreground">
            Review the draft, edit if needed, then confirm to save. Nothing is
            logged until you confirm.
          </p>
          <div className="grid gap-3 md:grid-cols-4">
            <div>
              <label className="mb-1 block text-xs font-medium">Date</label>
              <input
                type="date"
                className="input"
                value={wDate}
                onChange={(e) => setWDate(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">Exercise</label>
              <input
                className="input"
                value={wExercise}
                onChange={(e) => setWExercise(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">Reps</label>
              <input
                type="number"
                className="input"
                value={wReps}
                onChange={(e) => setWReps(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">Weight</label>
              <input
                type="number"
                className="input"
                value={wWeight}
                onChange={(e) => setWWeight(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium">
              Notes (optional)
            </label>
            <input
              className="input"
              value={wNotes}
              onChange={(e) => setWNotes(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn-primary text-xs"
              disabled={confirming}
              onClick={() => void handleConfirm()}
            >
              {confirming ? "Saving…" : "Confirm & log workout"}
            </button>
            <button
              type="button"
              className="text-xs text-muted-foreground underline-offset-2 hover:underline"
              onClick={clearDraft}
              disabled={confirming}
            >
              Discard draft
            </button>
          </div>
        </div>
      ) : null}

      {parsed?.type === "habit" ? (
        <div className="space-y-3 rounded-xl border border-border/60 bg-background/40 p-3">
          <p className="text-xs text-muted-foreground">
            Review the draft, edit if needed, then confirm to save. Nothing is
            logged until you confirm.
          </p>
          {habits.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              Create a habit first to confirm this check-in.
            </p>
          ) : (
            <div className="grid gap-3 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium">Habit</label>
                <select
                  className="input"
                  value={hHabitId}
                  onChange={(e) => setHHabitId(e.target.value)}
                >
                  {habits.map((h) => (
                    <option key={h._id} value={h._id}>
                      {h.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">Date</label>
                <input
                  type="date"
                  className="input"
                  value={hDate}
                  onChange={(e) => setHDate(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">
                  Completed
                </label>
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={hCompleted}
                  onChange={(e) => setHCompleted(e.target.checked)}
                />
              </div>
              {selectedHabit?.targetType === "numeric" ? (
                <div>
                  <label className="mb-1 block text-xs font-medium">Value</label>
                  <input
                    type="number"
                    className="input"
                    value={hValue}
                    onChange={(e) => setHValue(e.target.value)}
                  />
                </div>
              ) : null}
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn-primary text-xs"
              disabled={confirming || habits.length === 0}
              onClick={() => void handleConfirm()}
            >
              {confirming ? "Saving…" : "Confirm & save check-in"}
            </button>
            <button
              type="button"
              className="text-xs text-muted-foreground underline-offset-2 hover:underline"
              onClick={clearDraft}
              disabled={confirming}
            >
              Discard draft
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
