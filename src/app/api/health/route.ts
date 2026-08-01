import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import { apiOk, apiError } from "@/lib/api-response";

/**
 * Public liveness/readiness probe for uptime monitors.
 * No auth. No secrets or stack traces in the response body.
 */
export async function GET() {
  const timestamp = new Date().toISOString();

  try {
    await dbConnect();

    // readyState: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
    if (mongoose.connection.readyState !== 1) {
      return apiError("Database unavailable", {
        status: 503,
        code: "DB_DISCONNECTED",
      });
    }

    return apiOk({
      status: "ok" as const,
      db: "connected" as const,
      timestamp,
    });
  } catch {
    return apiError("Database unavailable", {
      status: 503,
      code: "DB_DISCONNECTED",
    });
  }
}
