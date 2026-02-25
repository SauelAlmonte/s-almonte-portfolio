import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Skill } from "@/lib/models/Skill";
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
  const skill = await Skill.findByIdAndUpdate(id, body, { new: true });
  return NextResponse.json({ skill });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectToDatabase();
  await Skill.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
