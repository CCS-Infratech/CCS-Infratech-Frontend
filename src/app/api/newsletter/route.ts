import { NextResponse } from "next/server";
import {
  mailTransport,
  MAIL_FROM,
  MAIL_TO,
  sendQuietly,
} from "@/lib/mailer";

const EMAIL_REGEX =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email =
      typeof body?.email === "string" ? body.email.trim() : "";

    if (!email) {
      return NextResponse.json(
        { error: "Email address is required." },
        { status: 400 }
      );
    }

    if (email.length > 254 || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!MAIL_TO) {
      console.error("[newsletter] EMAIL_TO is not configured.");
      return NextResponse.json(
        { error: "Newsletter service is temporarily unavailable." },
        { status: 500 }
      );
    }

    const safeEmail = escapeHtml(email);

    const adminMailOptions = {
      from: MAIL_FROM,
      to: MAIL_TO,
      replyTo: email,
      subject: "📩 New CCS Infratech Newsletter Subscription",
      text: `New newsletter subscription request from ${email}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="margin:0 0 16px;color:#222;">
            New Newsletter Subscription
          </h2>
          <p style="margin:0 0 12px;color:#555;">
            A visitor subscribed to the CCS Infratech newsletter.
          </p>
          <div style="padding:16px;background:#f7f7f7;border-radius:8px;">
            <strong>Email:</strong> ${safeEmail}
          </div>
        </div>
      `,
    };

    await mailTransport.sendMail(adminMailOptions);

    const confirmationMailOptions = {
      from: MAIL_FROM,
      to: email,
      subject: "You're subscribed to CCS Infratech",
      text: "Thank you for subscribing to CCS Infratech updates.",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="margin:0 0 16px;color:#222;">
            Thank you for subscribing!
          </h2>
          <p style="margin:0;color:#555;line-height:1.6;">
            You have successfully subscribed to CCS Infratech updates.
          </p>
        </div>
      `,
    };

    await sendQuietly(
      confirmationMailOptions,
      "newsletter confirmation"
    );

    return NextResponse.json({
      success: true,
      message: "Thanks for subscribing to CCS Infratech.",
    });
  } catch (error) {
    console.error("[newsletter] Subscription failed:", error);

    return NextResponse.json(
      { error: "Failed to process your subscription. Please try again." },
      { status: 500 }
    );
  }
}
