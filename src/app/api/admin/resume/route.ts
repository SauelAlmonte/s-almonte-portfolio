import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { ResumeData } from "@/lib/models/ResumeData";
import { auth } from "@/auth";

const ACTIONS = new Set([
  "updateSummary",
  "updateFileUrl",
  "updateResumePdfUrls",
  "addExperience",
  "updateExperience",
  "deleteExperience",
  "addEducation",
  "updateEducation",
  "deleteEducation",
  "addCertification",
  "updateCertification",
  "deleteCertification",
]);

async function getOrCreateResume() {
  let doc = await ResumeData.findOne();
  if (!doc) doc = await ResumeData.create({});
  return doc;
}

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectToDatabase();
    const resume = await getOrCreateResume();
    return NextResponse.json({ resume });
  } catch (err) {
    console.error("[admin/resume GET]", err);
    return NextResponse.json(
      { error: "Database unavailable. Check MONGODB_URI and Atlas network access." },
      { status: 503 }
    );
  }
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { action?: string; data?: Record<string, unknown>; id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { action, data, id } = body;
  if (typeof action !== "string" || !ACTIONS.has(action)) {
    return NextResponse.json({ error: "Unknown or missing action." }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const resume = await getOrCreateResume();

    switch (action) {
      case "updateSummary":
        resume.summary = typeof data?.summary === "string" ? data.summary : "";
        break;
      case "updateFileUrl":
        resume.resumeFileUrl =
          typeof data?.resumeFileUrl === "string" ? data.resumeFileUrl.trim() : "";
        break;
      case "updateResumePdfUrls": {
        const sw =
          typeof data?.resumeFileUrl === "string" ? data.resumeFileUrl.trim() : "";
        const it =
          typeof data?.resumeItFileUrl === "string" ? data.resumeItFileUrl.trim() : "";
        resume.resumeFileUrl = sw;
        resume.resumeItFileUrl = it;
        break;
      }
      case "addExperience":
        resume.experience.push(data ?? {});
        break;
      case "updateExperience": {
        const expIdx = resume.experience.findIndex(
          (e: { _id: { toString: () => string } }) => e._id.toString() === id
        );
        if (expIdx > -1) Object.assign(resume.experience[expIdx], data ?? {});
        break;
      }
      case "deleteExperience":
        resume.experience = resume.experience.filter(
          (e: { _id: { toString: () => string } }) => e._id.toString() !== id
        );
        break;
      case "addEducation":
        resume.education.push(data ?? {});
        break;
      case "updateEducation": {
        const eduIdx = resume.education.findIndex(
          (e: { _id: { toString: () => string } }) => e._id.toString() === id
        );
        if (eduIdx > -1) Object.assign(resume.education[eduIdx], data ?? {});
        break;
      }
      case "deleteEducation":
        resume.education = resume.education.filter(
          (e: { _id: { toString: () => string } }) => e._id.toString() !== id
        );
        break;
      case "addCertification":
        resume.certifications.push(data ?? {});
        break;
      case "updateCertification": {
        const certIdx = resume.certifications.findIndex(
          (e: { _id: { toString: () => string } }) => e._id.toString() === id
        );
        if (certIdx > -1) Object.assign(resume.certifications[certIdx], data ?? {});
        break;
      }
      case "deleteCertification":
        resume.certifications = resume.certifications.filter(
          (e: { _id: { toString: () => string } }) => e._id.toString() !== id
        );
        break;
      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

    await resume.save();
    return NextResponse.json({ resume });
  } catch (err) {
    console.error("[admin/resume PATCH]", err);
    return NextResponse.json(
      { error: "Could not save resume. Check database connection and input." },
      { status: 503 }
    );
  }
}
