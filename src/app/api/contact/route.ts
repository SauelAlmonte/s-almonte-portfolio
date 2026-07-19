import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { render } from "@react-email/components";
import { ContactNotification } from "@/emails/ContactNotification";
import { ContactThankYou } from "@/emails/ContactThankYou";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Subscriber } from "@/lib/models/Subscriber";

const resend = new Resend(process.env.RESEND_API_KEY);

const ContactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .regex(/^[\+]?[\d\s\-\(\)]{7,20}$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  subject: z.string().min(3, "Subject must be at least 3 characters").max(150),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
  subscribe: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = ContactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid form data", issues: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, phone, subject, message, subscribe } = result.data;
    const sentAt = new Date().toLocaleString("en-US", {
      timeZone: "America/New_York",
      dateStyle: "full",
      timeStyle: "short",
    });

    /* Render both email templates in parallel */
    const [notificationHtml, thankYouHtml] = await Promise.all([
      render(ContactNotification({ senderName: name, senderEmail: email, subject, message, sentAt })),
      render(ContactThankYou({ senderName: name })),
    ]);

    /* Send both emails in parallel */
    console.log("📧 Attempting to send emails...", { to: process.env.CONTACT_EMAIL });

    const [notificationResult, thankYouResult] = await Promise.allSettled([
      resend.emails.send({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: process.env.CONTACT_EMAIL!,
        replyTo: email,
        subject: `[Portfolio] ${subject} — from ${name}${phone ? ` · ${phone}` : ""}`,
        html: notificationHtml,
      }),
      resend.emails.send({
        from: "Sauel Almonte <onboarding@resend.dev>",
        to: process.env.CONTACT_EMAIL!,
        subject: `Thanks for reaching out, ${name.split(" ")[0]}!`,
        html: thankYouHtml,
      }),
    ]);

    console.log("📬 Notification result:", JSON.stringify(notificationResult));
    console.log("📬 ThankYou result:", JSON.stringify(thankYouResult));

    if (notificationResult.status === "rejected") {
      console.error("Failed to send notification email:", notificationResult.reason);
      return NextResponse.json(
        { error: "Failed to send message. Please try again." },
        { status: 500 }
      );
    }

    if (thankYouResult.status === "rejected") {
      console.warn("Thank you email failed:", thankYouResult.reason);
    }

    /* Save subscriber to MongoDB if they opted in */
    if (subscribe) {
      try {
        console.log("💾 Connecting to MongoDB...");
        await connectToDatabase();
        console.log("💾 Saving subscriber:", email);
        const saved = await Subscriber.findOneAndUpdate(
          // `$eq` forces string equality so a query-operator object can never reach
          // the filter (NoSQL object injection). Zod already guarantees `email` is a
          // string here; this is the explicit, scanner-legible defense the repo's
          // CLAUDE.md mandates for identifier-keyed queries.
          { email: { $eq: email.toLowerCase() } },
          { name, phone: phone || undefined, isActive: true },
          { upsert: true, new: true }
        );
        console.log("✅ Subscriber saved:", saved?._id);
      } catch (dbError) {
        console.error("❌ Failed to save subscriber:", dbError);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
