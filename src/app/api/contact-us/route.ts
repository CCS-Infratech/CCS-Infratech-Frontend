import adminContactNotification from "@/lib/email-templates/adminContactNotification";
import customerContactThankYou from "@/lib/email-templates/customerContactThankYou";
import { NextResponse } from "next/server";
import { mailTransport, MAIL_FROM, sendQuietly } from "@/lib/mailer";

const budgetMap: Record<string, string> = {
  "upto-75": "Up to ₹75 Lacs",
  "75-100": "₹75L - ₹1 Cr",
  "100-150": "₹1 - 1.5 Cr",
  "150-plus": "₹1.5 Cr+",
};

const projectMap: Record<string, string> = {
  amor: "Amor",
};

const typeMap: Record<string, string> = {
  plot: "Plot",
  villas: "Villas",
};

export async function POST(request: Request) {
  try {
    const { name, phone, email, project, type, investment } =
      await request.json();

    if (!name || !phone || !email || !project || !type || !investment) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: name, phone, email, project, type, investment",
        },
        { status: 400 },
      );
    }

    // Additional validation
    if (name.trim().length < 2) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters" },
        { status: 400 },
      );
    }

    if (phone.trim().length < 10) {
      return NextResponse.json(
        { error: "Please provide a valid phone number" },
        { status: 400 },
      );
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 },
      );
    }

    // Get current time in IST
    const currentTime = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "full",
      timeStyle: "short",
    });

    // Format display values
    const investmentDisplay = budgetMap[investment] || investment;
    const projectDisplay = projectMap[project] || project;
    const typeDisplay = typeMap[type] || type;

    // Save enquiry to CCS Lead Management
    try {
      const backendUrl =
        process.env.CCS_BACKEND_URL || "http://127.0.0.1:8000";

      const leadResponse = await fetch(`${backendUrl}/api/v1/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "CONTACT",
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          project: projectDisplay,
          propertyType: typeDisplay,
          budget: investmentDisplay,
        }),
        cache: "no-store",
      });

      if (!leadResponse.ok) {
        console.error(
          "Failed to save contact enquiry to lead management:",
          await leadResponse.text(),
        );
      } else {
        const leadData = await leadResponse.json();
        console.log(
          "Contact enquiry saved to lead management:",
          leadData?.data?.id,
        );
      }
    } catch (leadError) {
      // Keep email submission working even if lead storage temporarily fails.
      console.error("Error saving contact enquiry:", leadError);
    }

    // Prepare admin email
    const adminMailOptions = {
      from: MAIL_FROM,
      to: process.env.EMAIL_TO,
      replyTo: email,
      subject: `🔥 New Contact Enquiry: ${name} - ${projectDisplay} ${typeDisplay}`,
      html: adminContactNotification({
        name,
        phone,
        email,
        project: projectDisplay,
        type: typeDisplay,
        investment: investmentDisplay,
        currentTime,
      }),
    };

    // Prepare customer email
    const customerMailOptions = {
      from: MAIL_FROM,
      to: email,
      subject: `Thank You for Your Interest in CCS INFRATECH, ${name}!`,
      html: customerContactThankYou({
        name,
        phone,
        email,
        project: projectDisplay,
        type: typeDisplay,
        investment: investmentDisplay,
        currentTime,
      }),
    };

    // Send both emails
    await mailTransport.sendMail(adminMailOptions);
    await sendQuietly(customerMailOptions, "contact thank-you");

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Enquiry submitted successfully! We'll contact you shortly.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error sending contact form email:", error);

    return NextResponse.json(
      {
        error:
          "Failed to submit enquiry. Please try again or contact us directly.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
