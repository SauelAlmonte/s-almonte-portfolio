import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { mongoConnectionHint } from "@/lib/db/mongo-errors";
import { Subscriber } from "@/lib/models/Subscriber";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const [total, active] = await Promise.all([
      Subscriber.countDocuments(),
      Subscriber.countDocuments({ isActive: true }),
    ]);

    return NextResponse.json({ total, active });
  } catch (err) {
    console.error("[admin/stats GET]", err);
    const hint = mongoConnectionHint(err);
    return NextResponse.json(
      {
        error: "Database unavailable. Check MONGODB_URI and Atlas network access.",
        ...(hint ? { hint } : {}),
      },
      { status: 503 }
    );
  }
}
