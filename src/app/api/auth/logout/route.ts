import { NextRequest } from "next/server";
import { apiError, apiOk } from "@/lib/api-response";
import { clearAuthCookie } from "@/lib/auth";
import { logError } from "@/lib/logger";

export async function POST(_req: NextRequest) {
  try {
    await clearAuthCookie();
    return apiOk({ message: "Logged out" });
  } catch (err) {
    logError("api/auth/logout", err);
    const message = err instanceof Error ? err.message : "Internal error";
    return apiError(message, { status: 500, code: "INTERNAL_ERROR" });
  }
}
