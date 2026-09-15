import adminLeadNotification from "@/lib/email-templates/adminLeadNotification";
import customerThankYou from "@/lib/email-templates/customerThankYou";
import { NextResponse } from "next/server";
import { mailTransport, MAIL_FROM, sendQuietly } from "@/lib/mailer";

const budgetMap: Record<string, string> = {
  "upto-75": "Up to ₹75 Lacs",
  "75-100": "₹75L - ₹1 Cr",
  "100-150": "₹1 - 1.5 Cr",
  "150-plus": "₹1.5 Cr+",
};

export async function POST(request: Request) {
  try {
    const { fullName, phone, email, budget } = await request.json();

    if (!fullName || !phone || !email || !budget) {
      return NextResponse.json(
        { error: "Missing required fields: fullName, phone, email, budget" },
        { status: 400 },
      );
    }

    const currentTime = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "full",
      timeStyle: "short",
    });

    const budgetDisplay = budgetMap[budget] || budget;

    const adminMailOptions = {
      from: MAIL_FROM,
      to: process.env.EMAIL_TO,
      replyTo: email,
      subject: `🔥 New Lead: ${fullName} - ${budgetDisplay}`,
      html: adminLeadNotification({
        fullName,
        phone,
        email,
        budget: budgetDisplay,
        currentTime,
      }),
    };

    const customerMailOptions = {
      from: MAIL_FROM,
      to: email,
      subject: `Thank You for Your Interest in CCS Infratech Villas, ${fullName}!`,
      html: customerThankYou({
        fullName,
        phone,
        email,
        budget: budgetDisplay,
        currentTime,
      }),
    };

    await mailTransport.sendMail(adminMailOptions);
    await sendQuietly(customerMailOptions, "lead thank-you");

    return NextResponse.json({
      message: "Emails sent successfully to both admin and customer",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    );
  }
}
