import { normalizeDiscoveryTags } from "./discovery-tags";

function asTrimmedString(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t.length > 0 ? t : undefined;
}

/**
 * Partial Mongo update from admin JSON (supports full form saves and small patches e.g. featured toggle).
 */
export function buildProjectPartialUpdate(body: unknown): Record<string, unknown> {
  if (!body || typeof body !== "object") return {};
  const b = body as Record<string, unknown>;
  const out: Record<string, unknown> = {};

  if (typeof b.title === "string") out.title = b.title.trim();
  if (typeof b.description === "string") out.description = b.description.trim();
  if (b.category === "fullstack" || b.category === "backend" || b.category === "cloud") {
    out.category = b.category;
  }
  if (typeof b.slug === "string" && b.slug.trim().length > 0) {
    out.slug = b.slug.trim();
  }
  if (Array.isArray(b.techStack)) {
    out.techStack = b.techStack.map((x) => String(x).trim()).filter(Boolean);
  }
  if ("tags" in b) {
    out.tags = normalizeDiscoveryTags(b.tags);
  }
  if ("liveUrl" in b) {
    const s = typeof b.liveUrl === "string" ? b.liveUrl.trim() : "";
    out.liveUrl = s.length > 0 ? s : undefined;
  }
  if ("repoUrl" in b) {
    const s = typeof b.repoUrl === "string" ? b.repoUrl.trim() : "";
    out.repoUrl = s.length > 0 ? s : undefined;
  }
  if ("imageGradient" in b && typeof b.imageGradient === "string") {
    const g = b.imageGradient.trim();
    out.imageGradient = g.length > 0 ? g : undefined;
  }
  if ("imageBase64" in b && typeof b.imageBase64 === "string") {
    out.imageBase64 = b.imageBase64.trim();
  }
  if ("comingSoon" in b && typeof b.comingSoon === "boolean") {
    out.comingSoon = b.comingSoon;
  }
  if ("featured" in b && typeof b.featured === "boolean") {
    out.featured = b.featured;
  }
  if ("order" in b) {
    const n = Number(b.order);
    if (Number.isFinite(n)) out.order = n;
  }

  return Object.fromEntries(Object.entries(out).filter(([, v]) => v !== undefined));
}

/** Full document for Project.create from admin (required fields must be present). */
export function buildProjectCreateDoc(body: unknown): Record<string, unknown> | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  const title = typeof b.title === "string" ? b.title.trim() : "";
  const description = typeof b.description === "string" ? b.description.trim() : "";
  const category = b.category;
  if (!title || !description) return null;
  if (category !== "fullstack" && category !== "backend" && category !== "cloud") return null;

  return {
    slug: asTrimmedString(b.slug),
    title,
    description,
    category,
    techStack: Array.isArray(b.techStack)
      ? b.techStack.map((x) => String(x).trim()).filter(Boolean)
      : [],
    tags: normalizeDiscoveryTags(b.tags),
    liveUrl: asTrimmedString(b.liveUrl),
    repoUrl: asTrimmedString(b.repoUrl),
    imageGradient: asTrimmedString(b.imageGradient),
    comingSoon: typeof b.comingSoon === "boolean" ? b.comingSoon : false,
    imageBase64: typeof b.imageBase64 === "string" ? b.imageBase64.trim() : "",
    featured: typeof b.featured === "boolean" ? b.featured : false,
    order: Number.isFinite(Number(b.order)) ? Number(b.order) : 0,
  };
}
