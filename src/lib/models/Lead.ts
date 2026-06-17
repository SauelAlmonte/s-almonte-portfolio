import { model, models, Schema } from "mongoose";

/**
 * A callback request captured by the public AI chat when a visitor volunteers
 * their own contact details. Kept separate from `Subscriber` (newsletter) so
 * chat leads are distinct and don't collide with the unique-email constraint —
 * a visitor may leave only a phone number.
 *
 * Stores ONLY visitor-volunteered data. Never Sauel's info. Length caps mirror
 * the zod validation in the chat route (defense in depth).
 */
const LeadSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, trim: true, lowercase: true, maxlength: 254 },
    phone: { type: String, trim: true, maxlength: 40 },
    reason: { type: String, trim: true, maxlength: 1000 },
    /** Where the lead came from — fixed to "chat" for now. */
    source: { type: String, default: "chat", trim: true },
  },
  { timestamps: true }
);

/**
 * Enforce the "email or phone required" contract at the schema level so it holds
 * for ANY write path, not just the chat route. Without this, a future/non-route
 * caller could persist a contactless, unusable lead.
 */
LeadSchema.pre("validate", function () {
  const hasEmail = typeof this.email === "string" && this.email.trim().length > 0;
  const hasPhone = typeof this.phone === "string" && this.phone.trim().length > 0;
  if (!hasEmail && !hasPhone) {
    this.invalidate("email", "Either email or phone is required.");
    this.invalidate("phone", "Either email or phone is required.");
  }
});

export const Lead = models.Lead ?? model("Lead", LeadSchema);
