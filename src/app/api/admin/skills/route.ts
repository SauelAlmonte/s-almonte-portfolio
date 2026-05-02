import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Skill } from "@/lib/models/Skill";
import { auth } from "@/auth";
import { buildSkillCreateDoc } from "@/lib/skills/admin-skill-write";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectToDatabase();
    const skills = await Skill.find().sort({ category: 1, order: 1, name: 1 }).lean();
    return NextResponse.json({ skills });
  } catch (err) {
    console.error("[admin/skills GET]", err);
    return NextResponse.json(
      { error: "Database unavailable. Check MONGODB_URI and Atlas network access." },
      { status: 503 }
    );
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const doc = buildSkillCreateDoc(body);
  if (!doc) {
    return NextResponse.json(
      { error: "Invalid skill: require non-empty name and category fullstack|backend|cloud." },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();
    const skill = await Skill.create(doc);
    return NextResponse.json({ skill }, { status: 201 });
  } catch (err) {
    console.error("[admin/skills POST]", err);
    return NextResponse.json(
      { error: "Could not create skill. Check input and database connection." },
      { status: 503 }
    );
  }
}
