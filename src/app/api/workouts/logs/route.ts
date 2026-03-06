import { NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { apiError, apiOk } from "@/lib/api-response";
import { WorkoutLog } from "@/models/Workout";
import { requireUser } from "@/lib/auth";
import { workoutLogSchema } from "@/lib/validation";
import type { WorkoutLogDTO } from "@/types/domain";

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);
    await dbConnect();

    const logs = await WorkoutLog.find({ userId: user.id })
      .sort({ date: -1 })
      .limit(50)
      .lean();

    const data: WorkoutLogDTO[] = logs.map((log) => ({
      _id: String(log._id),
      userId: log.userId,
      date: log.date.toISOString(),
      exercises: log.exercises.map((ex) => ({
        exerciseId: ex.exerciseId,
        name: ex.name,
        sets: ex.sets.map((set) => ({
          reps: set.reps,
          weight: set.weight,
          notes: set.notes,
        })),
      })),
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
    const parsed = workoutLogSchema.safeParse(json);
    if (!parsed.success) {
      return apiError("Invalid payload", {
        status: 400,
        code: "INVALID_PAYLOAD",
      });
    }

    await dbConnect();

    const created = await WorkoutLog.create({
      userId: user.id,
      date: new Date(parsed.data.date),
      exercises: parsed.data.exercises,
    });

    const data: WorkoutLogDTO = {
      _id: String(created._id),
      userId: created.userId,
      date: created.date.toISOString(),
      exercises: created.exercises.map((ex) => ({
        exerciseId: ex.exerciseId,
        name: ex.name,
        sets: ex.sets.map((set) => ({
          reps: set.reps,
          weight: set.weight,
          notes: set.notes,
        })),
      })),
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
