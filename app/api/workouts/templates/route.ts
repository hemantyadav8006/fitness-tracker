import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { apiError, apiOk } from "@/lib/api-response";
import { WorkoutTemplate } from "@/models/Workout";
import { requireUser } from "@/lib/auth";
import { workoutTemplateSchema } from "@/lib/validation";
import type { WorkoutTemplateDTO } from "@/types/domain";

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);
    await connectToDatabase();

    const templates = await WorkoutTemplate.find({ userId: user.id }).sort({ name: 1 }).lean();

    const data: WorkoutTemplateDTO[] = templates.map((t) => ({
      _id: String(t._id),
      name: t.name,
      exercises: t.exercises.map((e) => ({
        _id: String(e._id),
        name: e.name
      }))
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
    const parsed = workoutTemplateSchema.safeParse(json);
    if (!parsed.success) {
      return apiError("Invalid payload", { status: 400, code: "INVALID_PAYLOAD" });
    }

    await connectToDatabase();

    const created = await WorkoutTemplate.create({
      userId: user.id,
      name: parsed.data.name,
      exercises: parsed.data.exercises
    });

    const data: WorkoutTemplateDTO = {
      _id: String(created._id),
      name: created.name,
      exercises: created.exercises.map((e) => ({
        _id: String(e._id),
        name: e.name
      }))
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

