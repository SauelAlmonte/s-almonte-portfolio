import type { ProjectCategory } from "./projects";

/** Short line under each category title on the landing Skills section */
export const SKILL_SECTION_SUBTITLE: Record<ProjectCategory, string> = {
  fullstack: "Building end-to-end web experiences",
  backend: "APIs, ML pipelines & AI automation",
  cloud: "Infrastructure built for scale",
};

/**
 * Canonical default skills (Mongo seed + public fallback).
 * Order within each category is array order.
 */
export const DEFAULT_SKILL_ROWS: Array<{
  category: ProjectCategory;
  name: string;
  proficiency: number;
}> = [
  { category: "fullstack", name: "Next.js / React", proficiency: 90 },
  { category: "fullstack", name: "JavaScript / TypeScript", proficiency: 88 },
  { category: "fullstack", name: "CSS / Tailwind CSS", proficiency: 85 },
  { category: "fullstack", name: "HTML / Accessibility", proficiency: 82 },
  { category: "backend", name: "Python", proficiency: 82 },
  { category: "backend", name: "Node.js / Express", proficiency: 78 },
  { category: "backend", name: "GPT-4 / LangChain", proficiency: 75 },
  { category: "backend", name: "Java / C++", proficiency: 65 },
  { category: "cloud", name: "Docker / Containers", proficiency: 78 },
  { category: "cloud", name: "AWS", proficiency: 72 },
  { category: "cloud", name: "CI/CD Pipelines", proficiency: 70 },
  { category: "cloud", name: "PostgreSQL / MongoDB", proficiency: 80 },
];

const EMPTY: Record<ProjectCategory, Array<{ name: string; proficiency: number }>> = {
  fullstack: [],
  backend: [],
  cloud: [],
};

/** Group defaults by category for the landing section when DB is empty. */
export function getDefaultSkillsByCategory(): Record<
  ProjectCategory,
  Array<{ name: string; proficiency: number }>
> {
  const out = {
    fullstack: [...EMPTY.fullstack],
    backend: [...EMPTY.backend],
    cloud: [...EMPTY.cloud],
  };
  for (const row of DEFAULT_SKILL_ROWS) {
    out[row.category].push({ name: row.name, proficiency: row.proficiency });
  }
  return out;
}

/** Documents for admin seed (upsert by name + category). */
export function getSkillSeedPayloads(): Array<{
  name: string;
  category: ProjectCategory;
  proficiency: number;
  order: number;
}> {
  const idx: Record<ProjectCategory, number> = { fullstack: 0, backend: 0, cloud: 0 };
  return DEFAULT_SKILL_ROWS.map((row) => ({
    name: row.name,
    category: row.category,
    proficiency: row.proficiency,
    order: idx[row.category]++,
  }));
}
