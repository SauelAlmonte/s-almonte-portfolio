import mongoose, { Schema, model, models } from "mongoose";

const ProjectSchema = new Schema(
  {
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
    imageBase64: { type: String },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Project =
  models.Project ?? model("Project", ProjectSchema);
