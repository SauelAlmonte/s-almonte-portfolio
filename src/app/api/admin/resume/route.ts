import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { ResumeData } from "@/lib/models/ResumeData";
import { auth } from "@/auth";

/* Always work with a single document — upsert pattern */
async function getOrCreateResume() {
  let doc = await ResumeData.findOne();
  if (!doc) doc = await ResumeData.create({});
  return doc;
}

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectToDatabase();
  const resume = await getOrCreateResume();
  return NextResponse.json({ resume });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectToDatabase();
  const { action, data, id } = await req.json();
  const resume = await getOrCreateResume();

  switch (action) {
    case "updateSummary":
      resume.summary = data.summary;
      break;
    case "updateFileUrl":
      resume.resumeFileUrl = data.resumeFileUrl;
      break;
    case "addExperience":
      resume.experience.push(data);
      break;
    case "updateExperience":
      { const expIdx = resume.experience.findIndex((e: { _id: { toString: () => string } }) => e._id.toString() === id);
      if (expIdx > -1) Object.assign(resume.experience[expIdx], data);
      break; }
    case "deleteExperience":
      resume.experience = resume.experience.filter((e: { _id: { toString: () => string } }) => e._id.toString() !== id);
      break;
    case "addEducation":
      resume.education.push(data);
      break;
    case "updateEducation":
      { const eduIdx = resume.education.findIndex((e: { _id: { toString: () => string } }) => e._id.toString() === id);
      if (eduIdx > -1) Object.assign(resume.education[eduIdx], data);
      break; }
    case "deleteEducation":
      resume.education = resume.education.filter((e: { _id: { toString: () => string } }) => e._id.toString() !== id);
      break;
    case "addCertification":
      resume.certifications.push(data);
      break;
    case "updateCertification":
      { const certIdx = resume.certifications.findIndex((e: { _id: { toString: () => string } }) => e._id.toString() === id);
      if (certIdx > -1) Object.assign(resume.certifications[certIdx], data);
      break; }
    case "deleteCertification":
      resume.certifications = resume.certifications.filter((e: { _id: { toString: () => string } }) => e._id.toString() !== id);
      break;
    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  await resume.save();
  return NextResponse.json({ resume });
}
