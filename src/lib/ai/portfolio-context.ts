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
 *   - `comingSoon` projects — filtered out of the query so an unreleased project's
 *     name/details cannot be exfiltrated even by a full system-prompt dump; only a
 *     count reaches the context
 *
 * If you add a field below, you are explicitly deciding the public can read it.
 */

const WHITELIST = {
  // -_id excludes the Mongo id; only public, display-safe fields remain. `comingSoon`
  // is intentionally absent: unreleased projects are filtered out of the query below,
  // so their fields must never be selected into the context in the first place.
  project: "title description category techStack tags liveUrl repoUrl featured -_id",
  skill: "name category proficiency -_id",
  // Explicit sub-field projection so resumeFileUrl / resumeItFileUrl (and any
  // future private field) are NEVER fetched — the wall holds at the DB layer,
  // not just in renderContext. Mirrors LeanResume exactly.
  resume:
    "summary " +
    "experience.company experience.role experience.period experience.location experience.description experience.bullets experience.tech " +
    "education.school education.degree education.field education.year education.description education.credentialUrl " +
    "certifications.name certifications.issuer certifications.year certifications.description certifications.credentialUrl " +
    "-_id",
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

  const [projects, skills, resume, comingSoonCount] = await Promise.all([
    // `comingSoon` projects are EXCLUDED from the model's context entirely — not just
    // hidden by a prompt instruction. Their names/descriptions/tech never leave the
    // database, so no prompt-injection or system-prompt dump can reveal an unreleased
    // project (an instruction to "not name them" is not a wall; this is). Only the
    // COUNT is surfaced (below), so the bot can still say "more are coming" without
    // naming anything.
    Project.find({ comingSoon: { $ne: true } })
      .select(WHITELIST.project)
      .sort({ order: 1 })
      .lean<LeanProject[]>(),
    Skill.find({}).select(WHITELIST.skill).sort({ order: 1 }).lean<LeanSkill[]>(),
    // Only allow-listed sub-fields are fetched — resumeFileUrl / resumeItFileUrl
    // (which could embed phone/address) never leave the database.
    ResumeData.findOne({}).select(WHITELIST.resume).lean<LeanResume | null>(),
    Project.countDocuments({ comingSoon: true }),
  ]);

  const value = renderContext({ projects, skills, resume, comingSoonCount });
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
  comingSoonCount,
}: {
  projects: LeanProject[];
  skills: LeanSkill[];
  resume: LeanResume | null;
  comingSoonCount: number;
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
      lines.push(`- ${p.title} [${p.category}]: ${p.description}`);
      if (p.techStack?.length) lines.push(`  Tech: ${p.techStack.join(", ")}`);
      if (links) lines.push(`  Links: ${links}`);
    }
  }

  // Surface only that MORE projects exist — never their names/details (those were
  // filtered out of the query). Lets the bot render the "coming soon" caption
  // without anything to leak.
  if (comingSoonCount > 0) {
    lines.push(
      "",
      "# UPCOMING",
      `${comingSoonCount} more project${comingSoonCount === 1 ? " is" : "s are"} in progress but not yet public. Names and details are withheld until launch — never invent, guess, or name them.`,
    );
  }

  return lines.join("\n");
}
