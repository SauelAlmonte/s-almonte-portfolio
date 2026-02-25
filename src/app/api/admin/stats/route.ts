import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Subscriber } from "@/lib/models/Subscriber";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();

  const [total, active] = await Promise.all([
    Subscriber.countDocuments(),
    Subscriber.countDocuments({ isActive: true }),
  ]);

  return NextResponse.json({ total, active });
}
