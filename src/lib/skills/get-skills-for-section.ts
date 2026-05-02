import { connectToDatabase } from "@/lib/db/mongoose";
import { Skill } from "@/lib/models/Skill";
import type { ProjectCategory } from "@/config/projects";
import { getDefaultSkillsByCategory } from "@/config/skills";

export type SkillSectionRow = { name: string; proficiency: number };

/**
 * Skills for the landing "Skills & Projects" cards: MongoDB when present,
 * otherwise defaults from `config/skills.ts`.
 */
export async function getSkillsForLandingSection(): Promise<
  Record<ProjectCategory, SkillSectionRow[]>
> {
  const fallback = getDefaultSkillsByCategory();
  try {
    await connectToDatabase();
    const docs = await Skill.find().sort({ category: 1, order: 1, name: 1 }).lean();
    if (!docs.length) return fallback;

    const out: Record<ProjectCategory, SkillSectionRow[]> = {
      fullstack: [],
      backend: [],
      cloud: [],
    };
    for (const d of docs) {
      const c = d.category as ProjectCategory;
      if (c !== "fullstack" && c !== "backend" && c !== "cloud") continue;
      out[c].push({ name: d.name, proficiency: d.proficiency });
    }
    const categories: ProjectCategory[] = ["fullstack", "backend", "cloud"];
    for (const c of categories) {
      if (out[c].length === 0) out[c] = fallback[c];
    }
    return out;
  } catch {
    return fallback;
  }
}
