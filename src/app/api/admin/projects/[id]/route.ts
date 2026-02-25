import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Project } from "@/lib/models/Project";
import { auth } from "@/auth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  await connectToDatabase();
  const project = await Project.findByIdAndUpdate(id, body, { new: true });
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
