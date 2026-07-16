import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Skill } from "@/lib/models/Skill";
import { auth } from "@/auth";
import { buildSkillPartialUpdate } from "@/lib/skills/admin-skill-write";
import { revalidatePublicHome } from "@/lib/cache/revalidate-public";
import { Types } from "mongoose";

const OBJECT_ID_PATTERN = /^[a-f\d]{24}$/i;

function parseSkillId(value: string): Types.ObjectId | null {
  if (!OBJECT_ID_PATTERN.test(value)) return null;

  return new Types.ObjectId(value);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const skillId = parseSkillId(id);
  if (!skillId) {
    return NextResponse.json({ error: "Invalid skill ID." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const patch = buildSkillPartialUpdate(body);
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "No valid fields to update." }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const skill = await Skill.findOneAndUpdate(
      { _id: { $eq: skillId } },
      { $set: patch },
      { new: true, runValidators: true }
    );
    if (!skill) {
      return NextResponse.json({ error: "Skill not found." }, { status: 404 });
    }
    revalidatePublicHome();
    return NextResponse.json({ skill });
  } catch (err) {
    console.error("[admin/skills PUT]", err);
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
  const skillId = parseSkillId(id);
  if (!skillId) {
    return NextResponse.json({ error: "Invalid skill ID." }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const removed = await Skill.findOneAndDelete({ _id: { $eq: skillId } });
    if (!removed) {
      return NextResponse.json({ error: "Skill not found." }, { status: 404 });
    }
    revalidatePublicHome();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[admin/skills DELETE]", err);
    return NextResponse.json(
      { error: "Database unavailable. Check MONGODB_URI and Atlas network access." },
      { status: 503 }
    );
  }
}
