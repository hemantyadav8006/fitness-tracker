import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { apiError, apiOk } from "@/lib/api-response";
import { WorkoutLog } from "@/models/Workout";
import { requireUser } from "@/lib/auth";

interface ChartPoint {
  date: string;
  workouts: number;
}

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);
    await connectToDatabase();

    const logs = await WorkoutLog.find({ userId: user.id }).sort({ date: 1 }).lean();

    const byDay = new Map<string, number>();
    for (const log of logs) {
      const key = log.date.toISOString().slice(0, 10);
      byDay.set(key, (byDay.get(key) ?? 0) + 1);
    }

    const data: ChartPoint[] = Array.from(byDay.entries()).map(([date, count]) => ({
      date,
      workouts: count
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

