import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Project } from "@/lib/models/Project";
import { PROJECTS } from "@/config/projects";
import { revalidatePublicProjects } from "@/lib/cache/revalidate-public";

/**
 * Copies `config/projects.ts` into MongoDB (upsert by `slug`).
 * Idempotent — safe to run multiple times while developing.
 */
export async function POST() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectToDatabase();

    for (let i = 0; i < PROJECTS.length; i++) {
      const p = PROJECTS[i];
      await Project.updateOne(
        { slug: p.id },
        {
          $set: {
            slug: p.id,
            title: p.title,
            description: p.description,
            category: p.category,
            techStack: p.techStack,
            liveUrl: p.liveUrl,
            repoUrl: p.repoUrl,
            imageGradient: p.imageGradient,
            comingSoon: p.comingSoon ?? false,
            featured: p.featured,
            order: i,
          },
        },
        { upsert: true }
      );
    }

    const projects = await Project.find().sort({ order: 1, createdAt: -1 }).lean();
    revalidatePublicProjects();
    return NextResponse.json({
      ok: true,
      message: `Imported ${PROJECTS.length} projects from portfolio config.`,
      projects,
    });
  } catch (err) {
    console.error("[admin/projects seed]", err);
    return NextResponse.json(
      { error: "Database unavailable or seed failed." },
      { status: 503 }
    );
  }
}
