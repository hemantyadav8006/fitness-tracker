import mongoose from "mongoose";

/**
 * Central MongoDB connection utility.
 *
 * Uses a global cached connection in development to avoid creating
 * multiple connections during hot reloads. In production on Vercel,
 * each serverless invocation establishes its own connection but reuses
 * the internal Mongoose connection pool.
 */

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not set in environment variables");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache | undefined;
}

const globalCache = global._mongooseCache || {
  conn: null,
  promise: null,
};

global._mongooseCache = globalCache;

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (mongoose.connection.readyState === 1) {
    console.log("🟢 MongoDB already connected");
    // Ensure global cache is also hydrated for reuse
    globalCache.conn = mongoose;
    return mongoose;
  }

  if (globalCache.conn) {
    console.log("🟢 MongoDB already connected");
    return globalCache.conn;
  }

  if (!globalCache.promise) {
    console.log("🟡 Creating new MongoDB connection...");
    mongoose.set("strictQuery", true);
    globalCache.promise = mongoose.connect(MONGODB_URI as string, {
      maxPoolSize: 10,
    });
  }

  globalCache.conn = await globalCache.promise;
  console.log("✅ MongoDB connection established");
  return globalCache.conn;
}
