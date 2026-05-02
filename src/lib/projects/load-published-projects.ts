import { PROJECTS, type ProjectCategory, type ProjectData } from "@/config/projects";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Project } from "@/lib/models/Project";
import { mongoProjectToProjectData } from "./mongo-to-published";

/**
 * Projects shown on `/skills/[category]` and equivalent public UI.
 * Uses MongoDB when connected and documents exist; otherwise config/projects.ts fallback.
 */
export async function loadPublishedProjectsByCategory(
  category: ProjectCategory
): Promise<ProjectData[]> {
  try {
    await connectToDatabase();
    const count = await Project.countDocuments();
    if (count === 0) {
      return PROJECTS.filter((p) => p.category === category);
    }

    const docs = await Project.find({ category }).sort({ order: 1, createdAt: -1 }).lean();
    const mapped = docs
      .map((d) => mongoProjectToProjectData(d))
      .filter((p): p is ProjectData => p !== null);

    return mapped.filter((p) => p.category === category);
  } catch {
    return PROJECTS.filter((p) => p.category === category);
  }
}
