import type { ProjectCategory } from "@/config/projects";

function clampProficiency(n: number): number {
  if (!Number.isFinite(n)) return 75;
  return Math.min(100, Math.max(1, Math.round(n)));
}

export function buildSkillCreateDoc(body: unknown): Record<string, unknown> | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  const name = typeof b.name === "string" ? b.name.trim() : "";
  if (!name) return null;
  const cat = b.category;
  if (cat !== "fullstack" && cat !== "backend" && cat !== "cloud") return null;

  let proficiency: number =
    typeof b.proficiency === "number" ? b.proficiency : Number(b.proficiency);
  proficiency = clampProficiency(proficiency);

  const orderRaw = Number(b.order);
  const order = Number.isFinite(orderRaw) ? orderRaw : 0;

  return {
    name,
    category: cat,
    proficiency,
    order,
  };
}

export function buildSkillPartialUpdate(body: unknown): Record<string, unknown> {
  if (!body || typeof body !== "object") return {};
  const b = body as Record<string, unknown>;
  const out: Record<string, unknown> = {};

  if (typeof b.name === "string") {
    const t = b.name.trim();
    if (t.length > 0) out.name = t;
  }
  if (b.category === "fullstack" || b.category === "backend" || b.category === "cloud") {
    out.category = b.category as ProjectCategory;
  }
  if ("proficiency" in b) {
    const n = typeof b.proficiency === "number" ? b.proficiency : Number(b.proficiency);
    out.proficiency = clampProficiency(n);
  }
  if ("order" in b) {
    const n = Number(b.order);
    if (Number.isFinite(n)) out.order = n;
  }

  return Object.fromEntries(Object.entries(out).filter(([, v]) => v !== undefined));
}
