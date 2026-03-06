import { NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { apiError, apiOk } from "@/lib/api-response";
import { Habit, HabitEntry } from "@/models/Habit";
import { requireUser } from "@/lib/auth";

interface ChartPoint {
  name: string;
  completion: number;
}

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);
    await dbConnect();

    const [habits, entries] = await Promise.all([
      Habit.find({ userId: user.id }).lean(),
      HabitEntry.find({ userId: user.id }).lean()
    ]);

    const byHabit = new Map<
      string,
      {
        name: string;
        total: number;
        completed: number;
      }
    >();

    for (const habit of habits) {
      byHabit.set(String(habit._id), {
        name: habit.name,
        total: 0,
        completed: 0
      });
    }

    for (const entry of entries) {
      const key = entry.habitId;
      const agg = byHabit.get(key);
      if (!agg) continue;
      agg.total += 1;
      if (entry.completed) {
        agg.completed += 1;
      }
    }

    const data: ChartPoint[] = Array.from(byHabit.values())
      .filter((h) => h.total > 0)
      .map((h) => ({
        name: h.name,
        completion: h.total === 0 ? 0 : (h.completed / h.total) * 100
      }));

    return apiOk(data);
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return apiError("Unauthorized", { status: 401, code: "UNAUTHORIZED" });
    }
    console.error(err);
    const message = err instanceof Error ? err.message : "Internal error";
    return apiError(message, { status: 500, code: "INTERNAL_ERROR" });
  }
}

