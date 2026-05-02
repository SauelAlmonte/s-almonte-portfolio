import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Project } from "@/lib/models/Project";
import { auth } from "@/auth";
import { buildProjectPartialUpdate } from "@/lib/projects/admin-project-write";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  await connectToDatabase();

  const patch = buildProjectPartialUpdate(body);
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "No valid fields to update." }, { status: 400 });
  }

  const project = await Project.findByIdAndUpdate(
    id,
    { $set: patch },
    { new: true, runValidators: true }
  );
  if (!project) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }
  return NextResponse.json({ project });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectToDatabase();
  await Project.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
