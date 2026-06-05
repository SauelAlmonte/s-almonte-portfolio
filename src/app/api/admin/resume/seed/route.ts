import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/db/mongoose";
import { ResumeData } from "@/lib/models/ResumeData";
import {
  RESUME_SEED_CERTIFICATIONS,
  RESUME_SEED_EDUCATION,
  getResumeSeedExperiences,
} from "@/config/resume";
import { revalidatePublicHome } from "@/lib/cache/revalidate-public";

async function getOrCreateResume() {
  let doc = await ResumeData.findOne();
  if (!doc) doc = await ResumeData.create({});
  return doc;
}

/**
 * Replaces experience, education, and certifications from `config/resume.ts` + `config/experience.ts`.
 * Does not change summary, resume PDF paths, or timestamps intent beyond save().
 */
export async function POST() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectToDatabase();
    const resume = await getOrCreateResume();

    resume.experience.splice(0, resume.experience.length);
    resume.education.splice(0, resume.education.length);
    resume.certifications.splice(0, resume.certifications.length);
    getResumeSeedExperiences().forEach((e) => {
      resume.experience.push(e);
    });
    RESUME_SEED_EDUCATION.forEach((e) => {
      resume.education.push(e);
    });
    RESUME_SEED_CERTIFICATIONS.forEach((c) => {
      resume.certifications.push(c);
    });

    await resume.save();
    revalidatePublicHome();
    const fresh = await ResumeData.findOne().lean();

    return NextResponse.json({
      ok: true,
      message: `Synced ${resume.experience.length} experience, ${resume.education.length} education, ${resume.certifications.length} certification entries from portfolio config.`,
      resume: fresh,
    });
  } catch (err) {
    console.error("[admin/resume seed]", err);
    return NextResponse.json(
      { error: "Database unavailable or seed failed." },
      { status: 503 }
    );
  }
}
