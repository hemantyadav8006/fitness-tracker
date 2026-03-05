import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { apiError, apiOk } from "@/lib/api-response";
import { ProgressEntry } from "@/models/Progress";
import { requireUser } from "@/lib/auth";

interface Params {
  params: {
    id: string;
  };
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const user = await requireUser(req);
    await connectToDatabase();

    const { id } = params;
    await ProgressEntry.deleteOne({ _id: id, userId: user.id });

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

