import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { apiError, apiOk } from "@/lib/api-response";
import { Habit } from "@/models/Habit";
import { requireUser } from "@/lib/auth";
import { habitSchema } from "@/lib/validation";
import type { HabitDTO } from "@/types/domain";

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);
    await connectToDatabase();

    const habits = await Habit.find({ userId: user.id }).sort({ name: 1 }).lean();

    const data: HabitDTO[] = habits.map((h) => ({
      _id: String(h._id),
      userId: h.userId,
      name: h.name,
      targetType: h.targetType,
      targetValue: h.targetValue ?? null
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
    const parsed = habitSchema.safeParse(json);
    if (!parsed.success) {
      return apiError("Invalid payload", { status: 400, code: "INVALID_PAYLOAD" });
    }

    await connectToDatabase();

    const created = await Habit.create({
      userId: user.id,
      ...parsed.data
    });

    const data: HabitDTO = {
      _id: String(created._id),
      userId: created.userId,
      name: created.name,
      targetType: created.targetType,
      targetValue: created.targetValue ?? null
    };

    return apiOk(data, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return apiError("Unauthorized", { status: 401, code: "UNAUTHORIZED" });
    }
    console.error(err);
    const message = err instanceof Error ? err.message : "Internal error";
    return apiError(message, { status: 500, code: "INTERNAL_ERROR" });
  }
}

