import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Subscriber } from "@/lib/models/Subscriber";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const subscribers = await Subscriber.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ subscribers });
  } catch (err) {
    console.error("[admin/subscribers GET]", err);
    return NextResponse.json(
      { error: "Database unavailable. Check MONGODB_URI and Atlas network access." },
      { status: 503 }
    );
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();
  await connectToDatabase();
  await Subscriber.findOneAndDelete({ _id: { $eq: id } });

  return NextResponse.json({ success: true });
}
