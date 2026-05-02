import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Skill } from "@/lib/models/Skill";
import { getSkillSeedPayloads } from "@/config/skills";

/**
 * Upserts default skills from `config/skills.ts` (match on name + category).
 */
export async function POST() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectToDatabase();
    const rows = getSkillSeedPayloads();
    for (const row of rows) {
      await Skill.updateOne(
        { name: row.name, category: row.category },
        { $set: { proficiency: row.proficiency, order: row.order } },
        { upsert: true }
      );
    }
    const skills = await Skill.find().sort({ category: 1, order: 1, name: 1 }).lean();
    return NextResponse.json({
      ok: true,
      message: `Synced ${rows.length} skills from portfolio config.`,
      skills,
    });
  } catch (err) {
    console.error("[admin/skills seed]", err);
    return NextResponse.json(
      { error: "Database unavailable or seed failed." },
      { status: 503 }
    );
  }
}
