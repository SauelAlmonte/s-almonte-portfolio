import { Types } from "mongoose";

const OBJECT_ID_PATTERN = /^[a-f\d]{24}$/i;

/**
 * Converts an untrusted value into a MongoDB ObjectId only when it is the
 * canonical 24-character hexadecimal representation.
 *
 * Keeping the runtime check here prevents request data from becoming a MongoDB
 * query object (for example, `{ $ne: null }`).
 */
export function parseObjectId(value: unknown): Types.ObjectId | null {
  if (typeof value !== "string" || !OBJECT_ID_PATTERN.test(value)) {
    return null;
  }

  return new Types.ObjectId(value);
}
