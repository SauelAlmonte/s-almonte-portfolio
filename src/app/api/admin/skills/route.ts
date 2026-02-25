import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Skill } from "@/lib/models/Skill";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectToDatabase();
  const skills = await Skill.find().sort({ category: 1, order: 1 }).lean();
  return NextResponse.json({ skills });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  await connectToDatabase();
  const skill = await Skill.create(body);
  return NextResponse.json({ skill }, { status: 201 });
}
