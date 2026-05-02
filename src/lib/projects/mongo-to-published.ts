import { CATEGORY_META, type ProjectCategory, type ProjectData } from "@/config/projects";
import { normalizeDiscoveryTags } from "@/lib/projects/discovery-tags";

/** Default Tailwind gradient when DB row has neither imageGradient nor image */
export function fallbackGradient(category: ProjectCategory): string {
  return `${CATEGORY_META[category].accentClass} via-transparent`;
}

interface LeanProjectLike {
  _id: unknown;
  slug?: string;
  title?: string;
  description?: string;
  category?: string;
  techStack?: string[];
  tags?: string[];
  liveUrl?: string;
  repoUrl?: string;
  imageGradient?: string;
  imageBase64?: string;
  featured?: boolean;
  comingSoon?: boolean;
  order?: number;
}

export function mongoProjectToProjectData(doc: LeanProjectLike): ProjectData | null {
  if (
    typeof doc.category !== "string" ||
    !["fullstack", "backend", "cloud"].includes(doc.category)
  ) {
    return null;
  }
  const cat = doc.category as ProjectCategory;
  const id =
    typeof doc.slug === "string" && doc.slug.length > 0
      ? doc.slug
      : String(doc._id);

  const tags = normalizeDiscoveryTags(doc.tags);

  return {
    id,
    title: doc.title ?? "Untitled",
    description: doc.description ?? "",
    techStack: Array.isArray(doc.techStack) ? doc.techStack : [],
    ...(tags.length > 0 ? { tags } : {}),
    liveUrl: doc.liveUrl,
    repoUrl: doc.repoUrl,
    imageGradient: doc.imageGradient?.trim()?.length ? doc.imageGradient : fallbackGradient(cat),
    featured: !!doc.featured,
    comingSoon: !!doc.comingSoon,
    category: cat,
    imageBase64: doc.imageBase64,
  };
}
