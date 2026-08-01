import mongoose from "mongoose";
import { logError } from "@/lib/logger";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: typeof import("mongoose") | null;
    promise: Promise<typeof import("mongoose")> | null;
  };
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

function debugLog(message: string): void {
  if (process.env.NODE_ENV !== "production") {
    console.log(message);
  }
}

export default async function dbConnect() {
  if (cached.conn) {
    debugLog("🟢 MongoDB already connected");
    return cached.conn;
  }

  if (!cached.promise) {
    debugLog("🟡 Creating new MongoDB connection...");

    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
      })
      .then((mongooseInstance) => {
        debugLog("✅ MongoDB connection established");
        return mongooseInstance;
      })
      .catch((error) => {
        logError("dbConnect", error, { phase: "mongoose.connect" });
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export { dbConnect };
