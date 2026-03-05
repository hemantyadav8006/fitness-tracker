import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { apiError, apiOk } from "@/lib/api-response";
import { HabitEntry } from "@/models/Habit";
import { requireUser } from "@/lib/auth";
import { habitEntrySchema } from "@/lib/validation";
import type { HabitEntryDTO } from "@/types/domain";

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const habitId = searchParams.get("habitId") ?? undefined;

    const query: Record<string, unknown> = { userId: user.id };
    if (habitId) {
      query.habitId = habitId;
    }

    const entries = await HabitEntry.find(query).sort({ date: -1 }).limit(90).lean();

    const data: HabitEntryDTO[] = entries.map((e) => ({
      _id: String(e._id),
      userId: e.userId,
      habitId: e.habitId,
      date: e.date.toISOString(),
      value: e.value ?? null,
      completed: e.completed
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

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const json = await req.json();
    const parsed = habitEntrySchema.safeParse(json);
    if (!parsed.success) {
      return apiError("Invalid payload", { status: 400, code: "INVALID_PAYLOAD" });
    }

    await connectToDatabase();

    const created = await HabitEntry.findOneAndUpdate(
      {
        userId: user.id,
        habitId: parsed.data.habitId,
        date: new Date(parsed.data.date)
      },
      {
        userId: user.id,
        habitId: parsed.data.habitId,
        date: new Date(parsed.data.date),
        value: parsed.data.value,
        completed: parsed.data.completed
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }
    ).lean();

    const data: HabitEntryDTO = {
      _id: String(created._id),
      userId: created.userId,
      habitId: created.habitId,
      date: created.date.toISOString(),
      value: created.value ?? null,
      completed: created.completed
    };

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

