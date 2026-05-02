import { Schema, model, models } from "mongoose";

const ProjectSchema = new Schema(
  {
    /** Stable key from seeded config `id`; used for idempotent imports */
    slug: { type: String, trim: true, sparse: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["fullstack", "backend", "cloud"],
      required: true,
    },
    techStack: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    liveUrl: { type: String },
    repoUrl: { type: String },
    /** Tailwind gradient classes for public cards (mirror of ProjectData.imageGradient) */
    imageGradient: { type: String },
    comingSoon: { type: Boolean, default: false },
    imageBase64: { type: String },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Project =
  models.Project ?? model("Project", ProjectSchema);
