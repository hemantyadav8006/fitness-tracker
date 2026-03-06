import { NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { apiError, apiOk } from "@/lib/api-response";
import { ProgressEntry } from "@/models/Progress";
import { requireUser } from "@/lib/auth";
import type { ProgressEntryDTO } from "@/types/domain";

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);
    await dbConnect();

    const entries = await ProgressEntry.find({ userId: user.id, weight: { $ne: null } })
      .sort({ date: 1 })
      .lean();

    const data: ProgressEntryDTO[] = entries.map((e) => ({
      _id: String(e._id),
      userId: e.userId,
      date: e.date.toISOString(),
      weight: e.weight ?? null,
      waist: e.waist ?? null,
      notes: e.notes
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

