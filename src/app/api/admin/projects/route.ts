import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Project } from "@/lib/models/Project";
import { auth } from "@/auth";
import { buildProjectCreateDoc } from "@/lib/projects/admin-project-write";
import { revalidatePublicProjects } from "@/lib/cache/revalidate-public";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectToDatabase();
    const projects = await Project.find().sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json({ projects });
  } catch (err) {
    console.error("[admin/projects GET]", err);
    return NextResponse.json(
      { error: "Database unavailable. Check MONGODB_URI and Atlas network access." },
      { status: 503 }
    );
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const doc = buildProjectCreateDoc(body);
  if (!doc) {
    return NextResponse.json(
      { error: "Missing required fields (title, description, category)." },
      { status: 400 }
    );
  }
  try {
    await connectToDatabase();
    const project = await Project.create(doc);
    revalidatePublicProjects();
    return NextResponse.json({ project }, { status: 201 });
  } catch (err) {
    console.error("[admin/projects POST]", err);
    return NextResponse.json(
      { error: "Database unavailable. Check MONGODB_URI and Atlas network access." },
      { status: 503 }
    );
  }
}
