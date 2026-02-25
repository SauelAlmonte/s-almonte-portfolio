import { model, models, Schema } from "mongoose";

const ExperienceSchema = new Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  period: { type: String, required: true },
  location: { type: String },
  description: { type: String },
  bullets: { type: [String], default: [] },
  order: { type: Number, default: 0 },
});

const EducationSchema = new Schema({
  school: { type: String, required: true },
  degree: { type: String, required: true },
  field: { type: String },
  year: { type: String },
  description: { type: String },
});

const CertificationSchema = new Schema({
  name: { type: String, required: true },
  issuer: { type: String, required: true },
  year: { type: String },
  credentialUrl: { type: String },
});

const ResumeDataSchema = new Schema(
  {
    summary: { type: String, default: "" },
    experience: { type: [ExperienceSchema], default: [] },
    education: { type: [EducationSchema], default: [] },
    certifications: { type: [CertificationSchema], default: [] },
    resumeFileUrl: { type: String },
  },
  { timestamps: true }
);

export const ResumeData =
  models.ResumeData ?? model("ResumeData", ResumeDataSchema);
