import { NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { apiError, apiOk } from "@/lib/api-response";
import { ProgressEntry } from "@/models/Progress";
import { requireUser } from "@/lib/auth";
import { progressEntrySchema } from "@/lib/validation";
import type { ProgressEntryDTO } from "@/types/domain";

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);
    await dbConnect();

    const entries = await ProgressEntry.find({ userId: user.id }).sort({ date: -1 }).limit(60).lean();

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

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const json = await req.json();
    const parsed = progressEntrySchema.safeParse(json);
    if (!parsed.success) {
      return apiError("Invalid payload", { status: 400, code: "INVALID_PAYLOAD" });
    }

    await dbConnect();

    const created = await ProgressEntry.findOneAndUpdate(
      {
        userId: user.id,
        date: new Date(parsed.data.date)
      },
      {
        userId: user.id,
        date: new Date(parsed.data.date),
        weight: parsed.data.weight,
        waist: parsed.data.waist,
        notes: parsed.data.notes
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }
    ).lean();

    const data: ProgressEntryDTO = {
      _id: String(created._id),
      userId: created.userId,
      date: created.date.toISOString(),
      weight: created.weight ?? null,
      waist: created.waist ?? null,
      notes: created.notes
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

