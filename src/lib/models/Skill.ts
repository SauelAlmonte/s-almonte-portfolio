import { model, models, Schema } from "mongoose";

const SkillSchema = new Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ["fullstack", "backend", "cloud"],
    required: true,
  },
  proficiency: { type: Number, min: 1, max: 100, required: true },
  order: { type: Number, default: 0 },
});

export const Skill = models.Skill ?? model("Skill", SkillSchema);
