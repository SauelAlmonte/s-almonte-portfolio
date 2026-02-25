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
  const subscribers = await Subscriber.find()
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ subscribers });
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();
  await connectToDatabase();
  await Subscriber.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}
