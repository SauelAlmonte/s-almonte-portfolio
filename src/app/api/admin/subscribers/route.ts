import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Subscriber } from "@/lib/models/Subscriber";
import { auth } from "@/auth";
import { parseObjectId } from "@/lib/db/object-id";

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

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const objectId = parseObjectId(
    typeof body === "object" && body !== null && "id" in body
      ? body.id
      : undefined
  );
  if (!objectId) {
    return NextResponse.json({ error: "Invalid subscriber ID." }, { status: 400 });
  }

  try {
    await connectToDatabase();
    await Subscriber.findOneAndDelete({ _id: { $eq: objectId } });
  } catch (err) {
    console.error("[admin/subscribers DELETE]", err);
    return NextResponse.json(
      { error: "Database unavailable. Check MONGODB_URI and Atlas network access." },
      { status: 503 }
    );
  }

  return NextResponse.json({ success: true });
}
