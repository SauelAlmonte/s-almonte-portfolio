import { model, models, Schema } from "mongoose";

const ResumeSchema = new Schema(
  {
    fileUrl: { type: String, required: true },
    version: { type: String, required: true },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Resume = models.Resume ?? model("Resume", ResumeSchema);
