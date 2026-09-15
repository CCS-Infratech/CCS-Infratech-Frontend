import adminVisitNotification from "@/lib/email-templates/adminVisitNotification";
import customerVisitConfirmation from "@/lib/email-templates/customerVisitConfirmation";
import { NextResponse } from "next/server";
import { mailTransport, MAIL_FROM, sendQuietly } from "@/lib/mailer";

const timeSlotMap: Record<string, string> = {
  "09:00-10:00": "09:00 AM - 10:00 AM",
  "10:00-11:00": "10:00 AM - 11:00 AM",
  "11:00-12:00": "11:00 AM - 12:00 PM",
  "12:00-13:00": "12:00 PM - 01:00 PM",
  "14:00-15:00": "02:00 PM - 03:00 PM",
  "15:00-16:00": "03:00 PM - 04:00 PM",
  "16:00-17:00": "04:00 PM - 05:00 PM",
  "17:00-18:00": "05:00 PM - 06:00 PM",
};

export async function POST(request: Request) {
  try {
    const { fullName, phone, email, date, time } = await request.json();

    if (!fullName || !phone || !date || !time) {
      return NextResponse.json(
        { error: "Missing required fields: fullName, phone, date, time" },
        { status: 400 },
      );
    }

    const currentTime = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "full",
      timeStyle: "short",
    });

    const visitDate = new Date(date).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const visitTime = timeSlotMap[time] || time;

    const adminMailOptions = {
      from: MAIL_FROM,
      to: process.env.EMAIL_TO,
      replyTo: email,
      subject: `🏢 New Site Visit Scheduled: ${fullName} - ${visitDate}`,
      html: adminVisitNotification({
        fullName,
        phone,
        email: email || "Not provided",
        visitDate,
        visitTime,
        currentTime,
      }),
    };

    const customerMailOptions = email
      ? {
          from: MAIL_FROM,
          to: email,
          subject: `Site Visit Confirmed - Club Towers, ${fullName}!`,
          html: customerVisitConfirmation({
            fullName,
            phone,
            email,
            visitDate,
            visitTime,
            currentTime,
          }),
        }
      : null;

    await mailTransport.sendMail(adminMailOptions);

    if (customerMailOptions) {
      await sendQuietly(customerMailOptions, "site-visit confirmation");
    }

    return NextResponse.json({
      message: email
        ? "Emails sent successfully to both admin and customer"
        : "Email sent successfully to admin",
      success: true,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    );
  }
}
