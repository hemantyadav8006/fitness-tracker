import { NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { apiError, apiOk } from "@/lib/api-response";
import { WorkoutLog } from "@/models/Workout";
import { requireUser } from "@/lib/auth";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireUser(req);
    await dbConnect();

    const { id } = await context.params;
    await WorkoutLog.deleteOne({ _id: id, userId: user.id });

    return apiOk({ deleted: true });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return apiError("Unauthorized", { status: 401, code: "UNAUTHORIZED" });
    }
    console.error(err);
    const message = err instanceof Error ? err.message : "Internal error";
    return apiError(message, { status: 500, code: "INTERNAL_ERROR" });
  }
}
