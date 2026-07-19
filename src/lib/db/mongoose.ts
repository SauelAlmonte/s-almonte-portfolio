import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable.");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  lastFailedAt: number | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose ?? {
  conn: null,
  promise: null,
  lastFailedAt: null,
};

if (!global.mongoose) {
  global.mongoose = cached;
}

const connectOptions = {
  bufferCommands: false,
  /* Fail fast instead of hanging indefinitely when Atlas/network blocks or URI is wrong */
  serverSelectionTimeoutMS: 10_000,
  connectTimeoutMS: 10_000,
  socketTimeoutMS: 45_000,
} as const;

/* With per-request rendering (nonce CSP), a down/unreachable DB would otherwise
 * cost every page view the full 10s server-selection timeout. After a failed
 * connect, reject immediately for this window so callers hit their config-data
 * fallbacks fast; one retry is allowed per window. */
const FAILURE_RETRY_WINDOW_MS = 30_000;

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    if (
      cached.lastFailedAt !== null &&
      Date.now() - cached.lastFailedAt < FAILURE_RETRY_WINDOW_MS
    ) {
      throw new Error(
        "MongoDB connection recently failed; retry deferred to avoid blocking renders."
      );
    }
    cached.promise = mongoose.connect(MONGODB_URI, connectOptions);
  }

  try {
    cached.conn = await cached.promise;
    cached.lastFailedAt = null;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    cached.conn = null;
    cached.lastFailedAt = Date.now();
    throw error;
  }
}
