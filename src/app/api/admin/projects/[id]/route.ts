import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Project } from "@/lib/models/Project";
import { auth } from "@/auth";
import { buildProjectPartialUpdate } from "@/lib/projects/admin-project-write";
import { revalidatePublicProjects } from "@/lib/cache/revalidate-public";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const patch = buildProjectPartialUpdate(body);
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "No valid fields to update." }, { status: 400 });
  }

  try {
    await connectToDatabase();

    const project = await Project.findByIdAndUpdate(
      String(id),
      { $set: patch },
      { new: true, runValidators: true }
    );
    if (!project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }
    revalidatePublicProjects();
    return NextResponse.json({ project });
  } catch (err) {
    console.error("[admin/projects PUT]", err);
    return NextResponse.json(
      { error: "Database unavailable. Check MONGODB_URI and Atlas network access." },
      { status: 503 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    await connectToDatabase();
    await Project.findByIdAndDelete(String(id));
    revalidatePublicProjects();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[admin/projects DELETE]", err);
    return NextResponse.json(
      { error: "Database unavailable. Check MONGODB_URI and Atlas network access." },
      { status: 503 }
    );
  }
}
