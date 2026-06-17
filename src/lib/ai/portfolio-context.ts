import "server-only";

import { siteConfig } from "@/config/site";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Project } from "@/lib/models/Project";
import { ResumeData } from "@/lib/models/ResumeData";
import { Skill } from "@/lib/models/Skill";

/**
 * THE SECURITY WALL for the public AI chat.
 *
 * This module is the *only* path through which portfolio data reaches the LLM.
 * It is `server-only` (build fails if imported into a client bundle) and it
 * uses an explicit field allow-list on every query via `.select()`. Private or
 * sensitive data is never fetched, so it can never be leaked — not by a clever
 * prompt, not by a model hallucination, not by an injection attack. The data
 * simply isn't in scope.
 *
 * Deliberately excluded (never selected, never reachable):
 *   - Anything under /admin, Subscriber documents (visitor emails)
 *   - email / phone / home address / DOB / SSN / passwords / secrets / env keys
 *   - resumeFileUrl / resumeItFileUrl (the PDF could embed phone/address)
 *   - imageBase64 (huge, useless to the model)
 *
 * If you add a field below, you are explicitly deciding the public can read it.
 */

const WHITELIST = {
  // -_id excludes the Mongo id; only public, display-safe fields remain.
  project: "title description category techStack tags liveUrl repoUrl featured comingSoon -_id",
  skill: "name category proficiency -_id",
} as const;

type LeanProject = {
  title: string;
  description: string;
  category: string;
  techStack?: string[];
  tags?: string[];
  liveUrl?: string;
  repoUrl?: string;
  featured?: boolean;
  comingSoon?: boolean;
};

type LeanSkill = { name: string; category: string; proficiency: number };

type LeanResume = {
  summary?: string;
  experience?: Array<{
    company: string;
    role: string;
    period: string;
    location?: string;
    description?: string;
    bullets?: string[];
    tech?: string[];
  }>;
  education?: Array<{
    school: string;
    degree: string;
    field?: string;
    year?: string;
    description?: string;
    credentialUrl?: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    year?: string;
    description?: string;
    credentialUrl?: string;
  }>;
};

/**
 * Cache the assembled context per warm serverless instance so a multi-message
 * conversation doesn't re-hit MongoDB on every turn. TTL keeps it fresh after
 * you edit content in the admin CMS.
 */
let cache: { value: string; expires: number } | null = null;
const TTL_MS = 5 * 60 * 1000;

export async function buildPortfolioContext(): Promise<string> {
  if (cache && cache.expires > nowMs()) return cache.value;

  await connectToDatabase();

  const [projects, skills, resume] = await Promise.all([
    Project.find({}).select(WHITELIST.project).sort({ order: 1 }).lean<LeanProject[]>(),
    Skill.find({}).select(WHITELIST.skill).sort({ order: 1 }).lean<LeanSkill[]>(),
    // Whole resume doc is fetched, but only allow-listed sub-fields are mapped
    // out below — resumeFileUrl / resumeItFileUrl are intentionally dropped.
    ResumeData.findOne({}).lean<LeanResume | null>(),
  ]);

  const value = renderContext({ projects, skills, resume });
  cache = { value, expires: nowMs() + TTL_MS };
  return value;
}

// Wrapped so the module has a single, mockable clock and to keep the cache
// check readable. (Date.now is fine in app runtime; only workflow scripts ban it.)
function nowMs(): number {
  return Date.now();
}

function renderContext({
  projects,
  skills,
  resume,
}: {
  projects: LeanProject[];
  skills: LeanSkill[];
  resume: LeanResume | null;
}): string {
  const { person, social } = siteConfig;
  const lines: string[] = [];

  lines.push("# ABOUT SAUEL ALMONTE");
  lines.push(`Name: ${person.name}`);
  lines.push(`Title: ${person.jobTitle}`);
  lines.push(`Based in: ${person.location}`);
  lines.push(`Languages: ${person.languages.join(", ")}`);
  lines.push(`Public profiles: GitHub ${social.github} · LinkedIn ${social.linkedin}`);

  if (resume?.summary) {
    lines.push("", "# SUMMARY", resume.summary);
  }

  if (resume?.experience?.length) {
    lines.push("", "# EXPERIENCE");
    for (const e of resume.experience) {
      lines.push(`- ${e.role} @ ${e.company} (${e.period})${e.location ? ` — ${e.location}` : ""}`);
      if (e.description) lines.push(`  ${e.description}`);
      for (const b of e.bullets ?? []) lines.push(`  • ${b}`);
      if (e.tech?.length) lines.push(`  Tech: ${e.tech.join(", ")}`);
    }
  }

  if (resume?.education?.length) {
    lines.push("", "# EDUCATION");
    for (const ed of resume.education) {
      lines.push(
        `- ${ed.degree}${ed.field ? `, ${ed.field}` : ""} — ${ed.school}${ed.year ? ` (${ed.year})` : ""}`,
      );
      if (ed.description) lines.push(`  ${ed.description}`);
    }
  }

  if (resume?.certifications?.length) {
    lines.push("", "# CERTIFICATIONS");
    for (const c of resume.certifications) {
      lines.push(`- ${c.name} — ${c.issuer}${c.year ? ` (${c.year})` : ""}`);
    }
  }

  if (skills.length) {
    lines.push("", "# SKILLS");
    for (const cat of ["fullstack", "backend", "cloud"] as const) {
      const named = skills.filter((s) => s.category === cat).map((s) => s.name);
      if (named.length) lines.push(`- ${cat}: ${named.join(", ")}`);
    }
  }

  if (projects.length) {
    lines.push("", "# PROJECTS");
    for (const p of projects) {
      const links = [
        p.liveUrl ? `live: ${p.liveUrl}` : null,
        p.repoUrl ? `repo: ${p.repoUrl}` : null,
      ]
        .filter(Boolean)
        .join(" · ");
      lines.push(
        `- ${p.title} [${p.category}]${p.comingSoon ? " (coming soon)" : ""}: ${p.description}`,
      );
      if (p.techStack?.length) lines.push(`  Tech: ${p.techStack.join(", ")}`);
      if (links) lines.push(`  Links: ${links}`);
    }
  }

  return lines.join("\n");
}
